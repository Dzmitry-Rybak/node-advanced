// node myFile.js - starting node.js process

const pendingTimers = [];
const pendingOsTasks = [];
const pendingOperations = [];

// New timers, tasks, operations are recorded from myFile running
myfile.runContents(); // after executing this function, we immediately enter the Node.js event loop

function shouldContinue() {
  /* node.js does 3 checks

  Check one: Any pending setTimeout, setInterval or setImmediate?
  Check two: Any pending OS tasks? (Like server listening to port)
  Check three: Any pending long tunning operations? (Like FS module)
  */
  return (
    pendingTimers.length || pendingOsTasks.length || pendingOperations.length
  );
}

// Entire body executes in one 'tick'
// if truthy Event Loop is going to continue to run / falsy Event Loop is going to be stopped and exit to terminal
while (shouldContinue()) {
  /* 
  1) Node looks at pendingTimers and sees if any function are ready to be called - node all relevant callbacks associated with each one. setTimeout, setInterval
  
  2) Node looks at pendingOsTasks and pendingOperations and call relevant callbacks
  
  3) Pause execution. Will continue when ...
  - a new pendingOsTask is done
  - a new pendingOsTask is done
  - a timer is about to complete

  4) Look at pendingTimers. Call any setImmediate 

  5) Handle any 'close' events
  */
}

// exit back to terminal - end of node.js process
