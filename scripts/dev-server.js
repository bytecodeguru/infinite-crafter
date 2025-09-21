#!/usr/bin/env node

import http from 'http';
import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distRelativePath = 'dist/infinite-craft-helper.user.js';
const distFilePath = path.join(projectRoot, distRelativePath);

const port = Number(process.env.PORT || 3000);
const skipQuality = process.argv.includes('--skip-quality');

async function runCommand(command, args) {
    return new Promise((resolve, reject) => {
        const child = spawn(command, args, {
            cwd: projectRoot,
            stdio: 'inherit'
        });

        child.on('exit', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`${command} ${args.join(' ')} exited with code ${code}`));
            }
        });

        child.on('error', reject);
    });
}

function startBuildWatch() {
    const watchArgs = ['build/build.js', 'watch'];
    if (skipQuality) {
        watchArgs.push('--skip-quality');
    }

    const child = spawn('node', watchArgs, {
        cwd: projectRoot,
        stdio: 'inherit'
    });

    child.on('exit', (code) => {
        if (code !== null) {
            console.log(`[dev-server] build watch exited with code ${code}`);
        }
    });

    child.on('error', (error) => {
        console.error('[dev-server] build watch failed:', error);
    });

    return child;
}

function startServer() {
    const server = http.createServer(async (req, res) => {
        const { url, method } = req;

        if (method !== 'GET') {
            res.writeHead(405, { 'Content-Type': 'text/plain' });
            res.end('Method Not Allowed');
            return;
        }

        if (url === '/' || url === '') {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
            res.end(`<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Infinite Craft Helper – Dev Server</title></head>
<body>
<p>Load the userscript from <a href="/dist/infinite-craft-helper.user.js">/dist/infinite-craft-helper.user.js</a>.</p>
<p>Add this URL to Tampermonkey to test the latest build.</p>
</body>
</html>`);
            return;
        }

        if (url === '/dist/infinite-craft-helper.user.js') {
            try {
                const content = await readFile(distFilePath, 'utf8');
                res.writeHead(200, {
                    'Content-Type': 'application/javascript; charset=utf-8',
                    'Cache-Control': 'no-store'
                });
                res.end(content);
            } catch (error) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end(`Failed to read ${distRelativePath}: ${error.message}`);
            }
            return;
        }

        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    });

    server.listen(port, () => {
        console.log(`[dev-server] Serving ${distRelativePath} on http://localhost:${port}/dist/infinite-craft-helper.user.js`);
        if (skipQuality) {
            console.log('[dev-server] Quality gates skipped in watch mode (build uses --skip-quality).');
        }
    });

    return server;
}

async function main() {
    console.log('[dev-server] Running initial build...');
    await runCommand('node', ['build/build.js']);

    const watchProcess = startBuildWatch();
    const server = startServer();

    const shutdown = () => {
        console.log('\n[dev-server] Shutting down...');
        server.close(() => {
            console.log('[dev-server] HTTP server stopped');
        });
        watchProcess.kill('SIGINT');
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
}

main().catch((error) => {
    console.error('[dev-server] Failed to start:', error);
    process.exit(1);
});
