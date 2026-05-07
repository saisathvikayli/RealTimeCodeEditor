import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import Editor from "@monaco-editor/react";

import {
  connectSocket,
} from "../services/socket";

const starterCodes = {

  javascript:
`console.log("Hello World");`,

  python:
`print("Hello World")`,

  java:
`public class Main {
  public static void main(String[] args) {
    System.out.println("Hello World");
  }
}`,

  cpp:
`#include<iostream>
using namespace std;

int main() {
  cout<<"Hello World";
}`,

  c:
`#include<stdio.h>

int main() {
  printf("Hello World");
}`,

  go:
`package main

import "fmt"

func main() {
  fmt.Println("Hello World")
}`,

  rust:
`fn main() {
  println!("Hello World");
}`,

  php:
`<?php
echo "Hello World";
?>`,

  ruby:
`puts "Hello World"`,

  typescript:
`console.log("Hello World");`,
};

export default function Room() {

  const { roomId } =
    useParams();

  const navigate =
    useNavigate();

  const [socket, setSocket] =
    useState(null);

  const [code, setCode] =
    useState(
      starterCodes.javascript
    );

  const [language, setLanguage] =
    useState("javascript");

  const [output, setOutput] =
    useState("");

  const [users, setUsers] =
    useState([]);

  const [activity, setActivity] =
    useState([]);

  const [messages, setMessages] =
    useState([]);

  const [text, setText] =
    useState("");

  const [files, setFiles] =
    useState([
      {
        name: "main.js",
        content:
          starterCodes.javascript,
      },
    ]);

  const [activeFile, setActiveFile] =
    useState("main.js");

  // socket init
  useEffect(() => {

    const s =
      connectSocket();

    setSocket(s);

    const user =
      JSON.parse(
        localStorage.getItem(
          "user"
        )
      ) || {
        username: "Guest",
      };

    s.on(
      "connect",
      () => {

        console.log(
          "JOINING ROOM"
        );

        s.emit(
          "room:join",
          {
            roomId,
            username:
              user.username,
          }
        );
      }
    );

    // room users
    s.on(
      "room:users",
      (data) => {

        console.log(
          "ROOM USERS:",
          data
        );

        setUsers(data || []);
      }
    );

    // activity
    s.on(
      "activity:log",
      (data) => {

        console.log(
          "ACTIVITY:",
          data
        );

        setActivity((prev) => [
          data,
          ...prev,
        ]);
      }
    );

    // chat
    s.on(
      "chat:message",
      (data) => {

        console.log(
          "CHAT:",
          data
        );

        setMessages((prev) => [
          ...prev,
          data,
        ]);
      }
    );

    // code sync
    s.on(
      "code:sync",
      (data) => {

        console.log(
          "CODE SYNC:",
          data
        );

        if (data.code) {

          setCode(
            data.code
          );
        }
      }
    );

    // files
    s.on(
      "files:sync",
      (data) => {

        console.log(
          "FILES:",
          data
        );

        if (data.files) {

          setFiles(
            data.files
          );

          if (
            data.files[0]
          ) {

            setActiveFile(
              data.files[0]
                .name
            );

            setCode(
              data.files[0]
                .content || ""
            );
          }
        }
      }
    );

    // output
    s.on(
      "code:output",
      (data) => {

        console.log(
          "OUTPUT:",
          data
        );

        setOutput(
          data.output ||
          data.error ||
          "No Output"
        );
      }
    );

    return () => {

      s.disconnect();
    };

  }, []);

  // typing
  const handleCode =
    (value) => {

      setCode(value);

      if (!socket) return;

      socket.emit(
        "code:change",
        {
          roomId,
          code: value,
        }
      );

      socket.emit(
        "file:update",
        {
          roomId,
          fileName:
            activeFile,
          content: value,
        }
      );
    };

  // run
  const runCode = () => {

    if (!socket) return;

    setOutput(
      "Running..."
    );

    socket.emit(
      "code:run",
      {
        roomId,
        code,
        language,
        input: "",
      }
    );
  };

  // send chat
  const sendMessage =
    () => {

      if (!text) return;

      const user =
        JSON.parse(
          localStorage.getItem(
            "user"
          )
        ) || {
          username:
            "Guest",
        };

      socket.emit(
        "chat:send",
        {
          roomId,
          sender:
            user.username,
          text,
        }
      );

      setText("");
    };

  // create file
  const createFile =
    () => {

      const fileName =
        prompt(
          "Enter file name"
        );

      if (
        !fileName
      ) return;

      socket.emit(
        "file:create",
        {
          roomId,
          fileName,
        }
      );

      setFiles((prev) => [
        ...prev,
        {
          name: fileName,
          content: "",
        },
      ]);
    };

  // language
  const changeLanguage =
    (lang) => {

      setLanguage(lang);

      setCode(
        starterCodes[lang]
      );
    };

  return (

    <div className="h-screen flex bg-[#020817] text-white overflow-hidden">

      {/* LEFT */}
      <div className="w-[220px] border-r border-[#1e293b] flex flex-col">

        <div className="p-5 text-5xl font-bold text-emerald-400">
          CodeCollab
        </div>

        {/* USERS */}
        <div className="p-4 border-t border-[#1e293b]">

          <div className="text-gray-400 mb-4">
            ONLINE USERS
          </div>

          <div className="space-y-3">

            {users.map(
              (
                user,
                index
              ) => (

                <div
                  key={index}
                  className="bg-[#0f172a] border border-[#1e293b] p-4 rounded-2xl"
                >

                  <div className="flex justify-between">

                    <div className="font-bold">
                      {
                        user.username
                      }
                    </div>

                    <div className="bg-emerald-400 text-black px-2 py-1 rounded-full text-xs">
                      {index === 0
                        ? "admin"
                        : "user"}
                    </div>
                  </div>

                  <div className="text-gray-400 text-sm mt-2">
                    Active now
                  </div>

                </div>
              )
            )}

          </div>
        </div>

        {/* ACTIVITY */}
        <div className="p-4 border-t border-[#1e293b]">

          <div className="text-gray-400 mb-4">
            LIVE ACTIVITY
          </div>

          <div className="space-y-2 text-sm">

            {activity.map(
              (
                item,
                index
              ) => (

                <div
                  key={index}
                  className="text-emerald-400"
                >
                  • {item}
                </div>
              )
            )}

          </div>
        </div>

        {/* FILES */}
        <div className="p-4 border-t border-[#1e293b] flex-1 overflow-auto">

          <div className="text-gray-400 mb-4">
            FILES
          </div>

          <div className="space-y-3">

            {files.map(
              (
                file,
                index
              ) => (

                <button
                  key={index}
                  onClick={() => {

                    setActiveFile(
                      file.name
                    );

                    setCode(
                      file.content
                    );
                  }}
                  className="w-full text-left border border-emerald-400 bg-[#0f172a] p-4 rounded-2xl"
                >
                  {file.name}
                </button>
              )
            )}

            <button
              onClick={
                createFile
              }
              className="w-full bg-emerald-400 text-black py-4 rounded-2xl font-bold"
            >
              + New File
            </button>

          </div>
        </div>
      </div>

      {/* CENTER */}
      <div className="flex-1 flex flex-col">

        {/* TOP */}
        <div className="h-[70px] border-b border-[#1e293b] flex items-center justify-between px-5">

          <div className="flex items-center gap-5">

            <div className="bg-[#0f172a] border border-[#1e293b] px-6 py-3 rounded-2xl font-bold">
              ROOM #{roomId}
            </div>

            <div className="text-emerald-400 font-bold">
              ● Live
            </div>
          </div>

          <div className="flex gap-4">

            <select
              value={language}
              onChange={(e) =>
                changeLanguage(
                  e.target.value
                )
              }
              className="bg-[#0f172a] border border-[#1e293b] px-6 py-3 rounded-2xl"
            >

              {Object.keys(
                starterCodes
              ).map((lang) => (

                <option
                  key={lang}
                >
                  {lang}
                </option>
              ))}

            </select>

            <button
              onClick={runCode}
              className="bg-emerald-400 text-black px-8 py-3 rounded-2xl font-bold"
            >
              ▶ Run
            </button>

            <button
              onClick={() =>
                navigate("/")
              }
              className="border border-red-500 text-red-400 px-8 py-3 rounded-2xl"
            >
              Leave
            </button>

          </div>
        </div>

        {/* EDITOR */}
        <div className="flex-1">

          <Editor
            theme="vs-dark"
            language={language}
            value={code}
            onChange={
              handleCode
            }
            height="100%"
          />
        </div>

        {/* OUTPUT */}
        <div className="h-[220px] bg-black border-t border-[#1e293b] p-5 overflow-auto">

          <div className="text-5xl font-bold mb-4">
            Output
          </div>

          <pre className="text-emerald-400 whitespace-pre-wrap">
            {output}
          </pre>

        </div>
      </div>

      {/* RIGHT */}
      <div className="w-[320px] border-l border-[#1e293b] flex flex-col">

        <div className="text-7xl font-bold p-6 border-b border-[#1e293b]">
          Team Chat
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-4">

          {messages.map(
            (
              msg,
              index
            ) => (

              <div
                key={index}
                className="bg-[#0f172a] p-4 rounded-2xl"
              >

                <div className="text-emerald-400 font-bold mb-2">
                  {msg.sender}
                </div>

                <div>
                  {msg.text}
                </div>

              </div>
            )
          )}

        </div>

        <div className="p-4 border-t border-[#1e293b] flex gap-3">

          <input
            value={text}
            onChange={(e) =>
              setText(
                e.target.value
              )
            }
            placeholder="Message..."
            className="flex-1 bg-[#0f172a] border border-[#1e293b] p-4 rounded-2xl outline-none"
          />

          <button
            onClick={
              sendMessage
            }
            className="bg-emerald-400 text-black px-6 rounded-2xl font-bold"
          >
            Send
          </button>

        </div>
      </div>
    </div>
  );
}