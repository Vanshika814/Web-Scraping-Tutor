# Web Scrapping Tutor 🚀

This project is a Node.js-based scraper designed to extract issue data from the Jira API. It automates the process of fetching, transforming, and storing Jira issues for specified projects. The scraper handles pagination, rate limiting, and data transformation, ensuring a reliable and efficient data extraction process. It also uses checkpointing to allow resuming the scraping process from where it left off.

## 🚀 Features

- **Automated Jira Data Extraction**: Fetches issue data from the Jira API for specified projects.
- **Pagination Handling**: Manages pagination to retrieve all issues, even when the number exceeds the API's page limit.
- **Rate Limit Handling**: Implements retry logic with exponential backoff to handle rate limiting and transient network errors.
- **Data Transformation**: Transforms raw issue data into a structured and cleaned format.
- **Checkpointing**: Saves progress to a checkpoint file, allowing the scraper to resume from where it left off in case of interruptions.
- **JSONL Output**: Writes the transformed data to a JSONL (JSON Lines) file for easy storage and processing.
- **Configuration-Driven**: Uses a configuration file to manage settings like project keys, API URLs, and file names.
- **Jira Markup Cleaning**: Removes Jira wiki markup from text fields, converting them to plain text.

## 🛠️ Tech Stack

- **Node.js**: JavaScript runtime environment for server-side execution.
- **axios**: Promise-based HTTP client for making requests to the Jira API.
- **p-retry**: Utility for retrying asynchronous functions with exponential backoff.
- **fs**: Node.js file system module for file operations.
- **fs-extra**: Extra file system utilities for Node.js (used for reading/writing JSON files).
- **JavaScript**: Programming language.
- **JSONL**: Data format for storing structured data.

## 📦 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1.  Clone the repository:

    ```bash
    git clone <repository-url>
    cd Web-Scraping-Tutor
    ```

2.  Install the dependencies:

    ```bash
    npm install # or yarn install
    ```

### Configuration

1.  Modify the `config.js` file to set the appropriate values:

    ```javascript
    // config.js
    module.exports = {
      JIRA_BASE_URL: 'YOUR_JIRA_BASE_URL', // e.g., 'https://your-jira-instance.com/rest/api/3'
      PROJECT_KEYS: ['PROJECT1', 'PROJECT2'],
      MAX_RESULTS_PER_PAGE: 50,
      CHECKPOINT_FILE: 'checkpoint.json',
      OUTPUT_FILE: 'output.jsonl',
    };
    ```

    Replace `YOUR_JIRA_BASE_URL` with your Jira instance's base URL.  Also, replace `PROJECT1` and `PROJECT2` with the Jira project keys you want to scrape.

### Running Locally

1.  Run the scraper:

    ```bash
    node main.js
    ```

    This will start the scraping process, fetch issue data from Jira, transform it, and write it to the output file specified in `config.js`. The scraper will also create and update a checkpoint file to track its progress.

## 💻 Usage

The scraper is designed to be run from the command line using Node.js.  After configuring the `config.js` file, simply execute `node main.js` to start the scraping process. The output will be written to the file specified by `OUTPUT_FILE` in `config.js`. The data is stored in JSONL format, where each line is a JSON object representing a transformed Jira issue.

## 📂 Project Structure

```
jira-issue-scraper/
├── config.js       # Configuration file
├── main.js         # Main entry point of the scraper
├── scrapper.js     # Module for fetching data from Jira API
├── transformer.js  # Module for transforming the data
├── package.json    # Project dependencies and scripts
├── README.md       # Project documentation
└── checkpoint.json # File to store the scraping progress
```
