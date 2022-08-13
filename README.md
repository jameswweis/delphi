# DELPHI: Dynamic Early-warning by Learning to Predict High Impact

## Overview
In a world of rapidly expanding science and limited resources, the identification of promising scientific research is critically important. In _Learning on Knowledge Graph Dynamics Provides Early Warning of Impactful Research_ we present DELPHI--a framework for calculating an early-warning score for impactful new research via the learning and visualization of high-dimensional, time-based patterns from the historical biotechnology publication network. 

In this repository we are providing requirements, installation guides, and instructions for both (a) demonstrating the DELPHI approach on a sample set of data via an Jupyter Notebook provided in a Docker container, and (b) a web application for the visualization of the DELPHI results over time, and organized/sliced by various features. We've attempted to make this introduction parallel to the provided details in the manuscript, and will be adding to, and further organizing, this repository in the next few months. 

## System Requirements
We've provided a Docker-based installation to avoid operating system and/or dependency concerns. This requires a recent version of Docker (documentation available [here](https://www.docker.com/get-started)). The provided code will download the [Jupyter Notebook Scientific Python Stack](https://github.com/jupyter/docker-stacks), and then automatically install other necessary dependencies (which are listed, along with version number, in `requirements.txt`).

The visualization application is provided pre-configured to be deployed on [Google Firebase](https://firebase.google.com) (documentation [here](https://firebase.google.com/docs/web/setup)) using the [npm](https://www.npmjs.com) (installation instructions [here](https://www.npmjs.com/get-npm)) package manager for [Node.js](https://nodejs.org/en/) (documentation [here](https://nodejs.org/en/docs/)). The dependencies necessary, along with the corresponding version number, are listed in `package.json`, and the metrics to be analyzed, along with their corresponding description, can be found in `config.json`. 

## Installation and Usage Guide
To explore the DELPHI demonstration in the provided Jupyter Notebook (documentation [here](https://jupyter.org)), ensure all environmental variables are configured appropriately (Docker will warn you if not) and then build and launch the Docker container (which should only take a few minutes on a normal computer):
```
docker-compose build
docker-compose up
```
As discussed in the Methods section of the manuscript, the full dataset was retrieved using the Lens.com API. Alternatively, you can run the same query, and download the resultant dataset, on the Lens.com website by [using this permanent link](https://link.lens.org/qBFxA8CRBVe). Or, you can use sample data and models, which are too large to be hosted here. A small sample dataset is uploaded [here](https://www.dropbox.com/t/S6xRJ8uamdWUOhqU), and which needs to be placed in the `data` folder. Similarly, you will need the trained models and parameters, which are uploaded [here](https://www.dropbox.com/t/Bx70rhsIXWtIC47R). Both of these files can be extracted in the standard way (e.g. `tar xvfz demo_models.tar.gz`) (please reach out directly for help if you encounter any problems). 

If you want to run on your own data, you should first download and structure a database as described in the manuscript. Datasets can be downloaded from [Lens.org](https://www.lens.org) and structured in your preferred database (for example, using [Neo4j](https://neo4j.com), with instructions available [here](https://neo4j.com/neo4j-graph-database/)), and then the feature matrix can be calculated and extracted using your database's query language (e.g. [Cypher](https://neo4j.com/developer/cypher/) for Neo4j). 

Then, to build the visualization application, first ensure your data can be accessed correctly (e.g. using the credentials in `firebase.js`), then install the dependencies and serve:
```
npm run install
npm run dev
```
Then build for production, launch the server, and generate static project: 
```
npm run build
npm run start
npm run generate
```
Then, to deploy to Firebase: 
```
npm run generate
firebase deploy
```
For more documentation, see the [Nuxt.js docs](https://nuxtjs.org). 

## Demonstration
The easiest way of quickly exploring the DELPHI models is via the [demonstration Jupyter notebook](notebooks/delphi_example_demo.ipynb). This notebook, which is demonstrated using the example dataset and models uploaded, can be run in a few minutes using the provided models, and shows the performance of the DELPHI models in predicting the impact of publicatons over three different years post-publication (i.e. using two years post-publication data to calculate an early-warning signal for years three to five). 

The result of correctly compiling and running the data visualization software should provide a served application resembling [this screenshot](SSEscreenshot.png). Of course, the specifics will vary depending on whether additional data is provided by the user for visualization.

## Citation
If you use this code for your own research, please cite this paper:
```Weis, J.W., Jacobson, J.M. Learning on knowledge graph dynamics provides an early warning of impactful research. Nat Biotechnol (2021). https://doi.org/10.1038/s41587-021-00907-6```

