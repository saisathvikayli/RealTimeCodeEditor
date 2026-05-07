import {
  useState,
  useEffect,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  connectSocket,
} from "../services/socket";

export default function Home() {

  const navigate =
    useNavigate();

  const [socket, setSocket] =
    useState(null);

  const [showModal, setShowModal] =
    useState(false);

  const [roomName, setRoomName] =
    useState("");

  const [language, setLanguage] =
    useState("javascript");

  const [password, setPassword] =
    useState("");

  const [joinRoomId, setJoinRoomId] =
    useState("");

  // connect socket
  useEffect(() => {

    const s =
      connectSocket();

    setSocket(s);

  }, []);

  // create room
  const createRoom =
    () => {

      if (!roomName) {

        alert(
          "Enter room name"
        );

        return;
      }

      const roomId =
        Math.random()
          .toString(36)
          .substring(2, 8)
          .toUpperCase();

      const user =
        JSON.parse(
          localStorage.getItem(
            "user"
          )
        ) || {
          username: "Guest",
        };

      socket.emit(
        "room:create",
        {
          roomId,
          username:
            user.username,

          roomName,
          language,
          password,
        }
      );

      navigate(
        `/room/${roomId}`
      );
    };

  // join room
  const joinRoom =
    () => {

      if (!joinRoomId)
        return;

      navigate(
        `/room/${joinRoomId}`
      );
    };

  return (

    <div className="min-h-screen bg-[#020817] text-white">

      {/* NAVBAR */}
      <div className="h-[75px] border-b border-[#1e293b] flex items-center justify-between px-6">

        <div className="flex items-center gap-3">

          <div className="w-12 h-12 rounded-xl bg-[#052e2b] flex items-center justify-center text-emerald-400 text-3xl font-bold">
            &lt;/&gt;
          </div>

          <div className="text-4xl font-bold">
            CodeCollab
          </div>

        </div>

        <div className="flex items-center gap-5">

          <div className="text-gray-400">
            Hey, Lucky
          </div>

          <div className="w-12 h-12 rounded-full bg-purple-400 flex items-center justify-center text-xl">
            L
          </div>

          <button className="border border-[#1e293b] px-5 py-2 rounded-xl">
            Sign out
          </button>

        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-[1100px] mx-auto pt-24">

        <div className="flex items-start justify-between">

          {/* LEFT */}
          <div>

            <h1 className="text-8xl font-bold mb-6">
              Your Rooms
            </h1>

            <p className="text-gray-400 text-2xl">
              Create a private room or join one using a room ID.
            </p>

          </div>

          {/* RIGHT */}
          <div className="flex gap-4">

            <input
              value={joinRoomId}
              onChange={(e) =>
                setJoinRoomId(
                  e.target.value
                )
              }
              placeholder="Room ID"
              className="bg-[#0f172a] border border-[#1e293b] px-6 py-4 rounded-2xl outline-none text-xl"
            />

            <button
              onClick={
                joinRoom
              }
              className="border border-white px-8 py-4 rounded-2xl font-bold text-xl"
            >
              Join Room
            </button>

            <button
              onClick={() =>
                setShowModal(
                  true
                )
              }
              className="bg-emerald-400 text-black px-10 py-4 rounded-2xl font-bold text-xl"
            >
              + New Room
            </button>

          </div>
        </div>

        {/* EMPTY */}
        <div className="h-[500px] flex items-center justify-center text-gray-500 text-2xl">

          No rooms yet. Create one to get started.

        </div>
      </div>

      {/* MODAL */}
      {showModal && (

        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">

          <div className="w-[500px] bg-[#111827] border border-[#1e293b] rounded-3xl p-10">

            <h2 className="text-5xl font-bold mb-6">
              Create a new room
            </h2>

            <p className="text-gray-400 mb-8 text-lg">
              Set a room password so only your team can join.
            </p>

            {/* ROOM NAME */}
            <div className="mb-6">

              <label className="text-gray-400 text-sm">
                ROOM NAME
              </label>

              <input
                value={roomName}
                onChange={(e) =>
                  setRoomName(
                    e.target.value
                  )
                }
                placeholder="e.g. Interview Prep"
                className="w-full mt-3 bg-[#0f172a] border border-emerald-400 p-5 rounded-2xl outline-none text-xl"
              />

            </div>

            {/* LANGUAGE */}
            <div className="mb-6">

              <label className="text-gray-400 text-sm">
                LANGUAGE
              </label>

              <select
                value={language}
                onChange={(e) =>
                  setLanguage(
                    e.target.value
                  )
                }
                className="w-full mt-3 bg-[#0f172a] border border-[#1e293b] p-5 rounded-2xl outline-none text-xl"
              >

                <option>
                  javascript
                </option>

                <option>
                  python
                </option>

                <option>
                  java
                </option>

                <option>
                  cpp
                </option>

                <option>
                  c
                </option>

                <option>
                  go
                </option>

                <option>
                  rust
                </option>

                <option>
                  php
                </option>

                <option>
                  ruby
                </option>

                <option>
                  typescript
                </option>

              </select>

            </div>

            {/* PASSWORD */}
            <div className="mb-8">

              <label className="text-gray-400 text-sm">
                ROOM PASSWORD
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                placeholder="Min. 4 characters"
                className="w-full mt-3 bg-[#0f172a] border border-[#1e293b] p-5 rounded-2xl outline-none text-xl"
              />

            </div>

            {/* BUTTONS */}
            <div className="flex gap-4">

              <button
                onClick={() =>
                  setShowModal(
                    false
                  )
                }
                className="flex-1 border border-[#1e293b] py-5 rounded-2xl text-xl"
              >
                Cancel
              </button>

              <button
                onClick={
                  createRoom
                }
                className="flex-1 bg-emerald-400 text-black py-5 rounded-2xl font-bold text-xl"
              >
                Create Room
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}