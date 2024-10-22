import Pusher from "pusher-js";

let pusherInstance;

export function getPusherInstance() {
  if (!pusherInstance) {
    pusherInstance = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
      cluster: process.env.REACT_APP_PUSHER_CLUSTER,
    });
  }
  return pusherInstance;
}
