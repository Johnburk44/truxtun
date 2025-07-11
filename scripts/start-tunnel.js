const ngrok = require('ngrok');
const { spawn } = require('child_process');

async function startTunnel() {
  try {
    // Start Next.js dev server
    const nextDev = spawn('npm', ['run', 'dev'], {
      stdio: 'inherit',
      shell: true
    });

    // Wait for Next.js to start
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Start ngrok tunnel
    const url = await ngrok.connect({
      addr: 3000,
      subdomain: 'truxtun-dev' // Note: this requires a paid ngrok account
    });

    console.log('\n=== Webhook URLs ===');
    console.log(`Hubspot Webhook URL: ${url}/api/webhooks/hubspot`);
    console.log('\nPress Ctrl+C to stop the servers\n');

    // Handle cleanup
    process.on('SIGINT', async () => {
      await ngrok.kill();
      nextDev.kill();
      process.exit();
    });

  } catch (error) {
    console.error('Error starting tunnel:', error);
    process.exit(1);
  }
}

startTunnel();
