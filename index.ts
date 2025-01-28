import express from "express";
import { config } from "dotenv";

config();

function launchAPI() {
    const app = express();
    
}

async function setupAPI() {

}

async function main() {
    await setupAPI();
    launchAPI();
}

main().catch(console.error);