import {redirect} from "react-router-dom";

const success = true; // Set this to true for a successful operation, or false for an error.
// const success = false; // Set this to true for a successful operation, or false for an error.

function getUserID(): Promise<number> {
  return new Promise((resolve, reject) => {
    // Simulate an asynchronous operation, e.g., fetching data from an API.
    setTimeout(() => {
      if (success) {
        // If the operation was successful, resolve the Promise with a result.
        resolve(1);
      } else {
        // If there was an error, reject the Promise with an error message.
        reject(null);
      }
    }, 100); // Simulated delay of 2 seconds
  });
}

async function routeUser(){
  try {
    await getUserID();
    return null;
  } catch (error) {
    return redirect("/");
  }
}

async function routeUserAtLogIn(){
  try {
    await getUserID();
    return redirect("/home");
  } catch (error) {
    return null;
  }
}

export {getUserID, routeUser, routeUserAtLogIn};