export const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiJiMzk1Njk2MC1mOTc4LTRmNDgtYWM5NS01MzNhZDViMTQ2MTAiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTcyODAyNTcwOCwiZXhwIjoxODg1ODEzNzA4fQ.sEqIJCr5uD1XYq7rdKhMKqiTPjZBe8G-itx3g5vq27I";//temporary-generated-auth-token-from dashboard

export const createNewRoom = async () => {
  const res = await fetch(`https://api.videosdk.live/v2/rooms`, {
    method: "POST",
    headers: {
      authorization: `${authToken}`,
      "Content-Type": "application/json",
    },
  });

  const { roomId } = await res.json();
  return roomId;
};