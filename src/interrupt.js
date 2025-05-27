import readline from 'readline';

const interrupt = async (delay) => {
  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  let interrupted = false;
  const interruption = () => {
    console.log("...interrupting...");
    interrupted = true;
  };
  process.stdin.on('keypress', interruption);
  await new Promise(res => setTimeout(res, delay));
  process.stdin.off('keypress', interruption);
  return interrupted;
};

export default interrupt;
