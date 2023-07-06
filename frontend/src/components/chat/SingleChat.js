// import React from "react";
// import { ChatState } from "../../context/ChatProvider";
// import { Box, Flex, Text } from "@chakra-ui/layout";
// import { ArrowBackIcon } from "@chakra-ui/icons";
// import { IconButton, Spinner, useToast } from "@chakra-ui/react";
// import { getSender, getSenderFull } from "./ChatLogics";
// import ProfileModal from "./extras/ProfileModal";
// import UpdateGroupChatModal from "./extras/UpdateGroupChatModal";

// const SingleChat = ({ fetchAgain, setFetchAgain }) => {
//   const { user, selectedChat, setSelectedChat } = ChatState();

//   return (
//     <div>
//       {selectedChat ? (
//         <>
//           <Flex flexDirection="row" justifyContent="flex-start">
//             <Text
//               pb={3}
//               px={2}
//               w="100%"
//               fontFamily="Work sans"
//               display="flex"
//               justifyContent={{ base: "space-between" }}
//               alignItems="center"
//             >
//               <IconButton
//                 position="absolute"
//                 left="4"
//                 display={{ base: "flex", md: "none" }}
//                 icon={<ArrowBackIcon />}
//                 onClick={() => setSelectedChat("")}
//               />
//               {
//               (!selectedChat.isGroupChat ? (
//                 <div>
//                   {getSender(user, selectedChat.users)}
//                   <ProfileModal
//                     user={getSenderFull(user, selectedChat.users)}
//                   />
//                 </div>
//               ) : (
//                 <>
//                   {selectedChat.chatName.toUpperCase()}
//                   {/* <UpdateGroupChatModal
//                     // fetchMessages={fetchMessages}
//                     fetchAgain={fetchAgain}
//                     setFetchAgain={setFetchAgain}
//                   /> */}
//                 </>
//               ))}
//             </Text>
//           </Flex>
//           <Box
//             display="flex"
//             flexDir="column"
//             // justifyContent="flex-end"
//             p={3}
//             bg="#E8E8E8"
//              w="1000%"
//              h="100%"
//             borderRadius="lg"
//             overflowY="hidden"
//           >
//                     {/* Message here */}

//           </Box>
//         </>
//       ) : (
//         <>

//           <Box
//             display="flex"
//             alignItems="center"
//             justifyContent="center"
//             h="100%"
//           >
//             <Text fontSize="3xl" pb={3} fontFamily="Work sans" color="black">
//               Click on a user to start chatting
//             </Text>
//           </Box>
//         </>
//       )}
//     </div>
//   );
// };

// export default SingleChat;

import React, { useEffect } from "react";
import { ChatState } from "../../context/ChatProvider";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  FormControl,
  IconButton,
  Input,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { getSender, getSenderFull } from "./ChatLogics";
import ProfileModal from "./extras/ProfileModal";
import UpdateGroupChatModal from "./extras/UpdateGroupChatModal";
import { useState } from "react";
import axios from "axios";
import ScrollableChat from "./ScrollableChat";
const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = ChatState();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);

  const toast = useToast();
  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "http://localhost:8000/api/message",
          { content: newMessage, chatId: selectedChat._id },
          config
        );
        // console.log(data);

        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to Load the Messages",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `http://localhost:8000/api/message/${selectedChat._id}`,
        config
      );
      console.log(messages);
      setMessages(data);
      setLoading(false);

      // socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  useEffect(() => {
    fetchMessages();
  }, [selectedChat]);
  const typingHandler = (e) => {
    setNewMessage(e.target.value);
  };
  return (
    <Box display="flex" flexDirection="column" w="100%" h="100%" p={3}>
      {selectedChat ? (
        <Box display="flex" flexDirection="column" h="100%" w="100%" p={3}>
          <Flex flexDirection="row" justifyContent="space-between">
            {/* <Text
            bg="blue"
              pb={3}
              fontSize="xxx-large"
              px={2}
              w="100%"
              h="100%"
              fontFamily="Work sans"
              display="flex"
              justifyContent={{ base: "center" }}
              alignItems="center"
            > */}
            <IconButton
              position="absolute"
              left="4"
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <Box
                w="100%"
                h="100%"
                display="flex"
                justifyContent="space-between"
              // justifyContent="center"
              >

                <Text fontWeight="bold" fontSize="xx-large" _firstLetter={{ textTransform: "uppercase" }}>
                  {getSender(user, selectedChat.users)}
                </Text>

                <ProfileModal user={getSenderFull(user, selectedChat.users)} />

              </Box>
            ) : (
              <Box
                w="100%"
                h="100%"
                display="flex"
                justifyContent="space-between"
              // justifyContent="center"
              >
                <Text fontWeight="bold" fontSize="xx-large" _firstLetter={{ textTransform: "uppercase" }}>
                  {selectedChat.chatName}
                </Text>

                <UpdateGroupChatModal

                  fetchMessages={fetchMessages}
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                />
              </Box>
            )}
            {/* </Text> */}
          </Flex>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            minHeight="300px" // Adjust the minHeight as needed
            borderRadius="lg"
            overflowY="auto" // Use auto to enable vertical scrolling when the content overflows
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}
            <FormControl
              onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={3}
            >
              {/* {istyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    // height={50}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )} */}
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>
            {/* Messages here */}
          </Box>
        </Box >
      ) : (
        <>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            h="100%"
          >
            <Text fontSize="3xl" pb={3} fontFamily="Work sans" color="black">
              Click on a user to start chatting
            </Text>
          </Box>
        </>
      )}
    </Box >
  );
};

export default SingleChat;
