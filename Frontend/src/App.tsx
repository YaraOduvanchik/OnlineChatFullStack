import { Flex } from "@chakra-ui/react";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { useState } from "react";
import { Chat, Message } from "./components/Chat";
import { useColorModeValue } from "./components/ui/color-mode";
import WaitingRoom from "./components/WaitingRoom";

function App() {
	const [connection, setConnection] = useState<HubConnection>();
	const [chatRoom, setChatRoom] = useState("");
	const [messages, setMessages] = useState<Message[]>([]);

	const joinChat = async (userName: string, chatRoom: string) => {
		const newConnection = new HubConnectionBuilder()
			.withUrl("http://localhost:8080/chat")
			.withAutomaticReconnect()
			.build();

		newConnection.on("ReceiveMessage", (userName: string, message: string) => {
			setMessages((prev) => [...prev, { text: message, author: userName }]);
		});

		try {
			await newConnection.start();
			await newConnection.invoke("JoinChat", { userName, chatRoom });

			setConnection(newConnection);
			setChatRoom(chatRoom);
		} catch (error) {
			console.error("Error connecting to SignalR:", error);
		}
	};

	const onSendMessage = async (message: string) => {
		if (!message) return;

		try {
			await connection!.invoke("SendMessage", message);
		} catch (error) {
			console.error("Error sending message:", error);
		}
	};

	const closeChat = async () => {
		await connection?.stop();
		setConnection(undefined);
	};

	return (
		<Flex
			minH="100vh"
			align="center"
			justify="center"
			bg={useColorModeValue("gray.50", "gray.900")}
		>
			{connection ? (
				<Chat
					messages={messages}
					chatRoom={chatRoom}
					onSendMessage={onSendMessage}
					closeChat={closeChat}
				/>
			) : (
				<WaitingRoom joinChat={joinChat} />
			)}
		</Flex>
	);
}

export default App;
