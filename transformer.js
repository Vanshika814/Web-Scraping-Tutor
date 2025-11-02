// transformer.js
const { Writable } = require('stream');

/**
 * Basic function to clean Jira wiki markup and convert to plain text.
 */
function cleanJiraMarkup(text) {
    if (!text) return "";
    // Remove common markup patterns (e.g., *bold*, {code}, [link|url])
    let cleanedText = text
        .replace(/(\r\n|\n|\r)/gm, " ") // Replace newlines with spaces
        .replace(/\{code[^}]*?}(.*?)\{code}/gs, " [CODE BLOCK] ") // Remove code blocks
        .replace(/\*(\s*?\w+?\s*?)\*/g, "$1") // Simple bold/italic removal
        .replace(/\[[^\]]*?\|[^\]]*?\]/g, " [LINK] ") // Remove complex links
        .trim();
    return cleanedText;
}

function transformIssue(rawIssue) {
    const fields = rawIssue.fields;
    
    // 1. Concatenate and clean comments
    // Handle cases where comment field might be null or undefined
    const commentsText = (fields.comment?.comments || [])
        .map(c => cleanJiraMarkup(c.body))
        .join(' --- '); // Use a clear separator for comments

    const transformed = {
        issue_key: rawIssue.key,
        project: rawIssue.key.split('-')[0],
        title: fields.summary || "",
        status: fields.status?.name || "Unknown",
        created_at: fields.created || "",
        description_text: cleanJiraMarkup(fields.description),
        comments_text: commentsText,
        // 2. Derived task for LLM (e.g., Classification)
        issue_type_label: fields.issuetype?.name || "Unknown"
    };

    return transformed;
}

/**
 * Writes a transformed object to the JSONL file stream.
 */
function writeToJsonl(stream, data) {
    // Stringify the object and append a newline for the JSONL format
    stream.write(JSON.stringify(data) + '\n');
}

module.exports = { transformIssue, writeToJsonl };