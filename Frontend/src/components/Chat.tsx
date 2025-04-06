import {
	Box,
	Button,
	Flex,
	HStack,
	Input,
	Text,
	VStack,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useColorModeValue } from "./ui/color-mode";

export type Message = { text: string; author: string };

interface WaitingRoomProps {
	chatRoom: string;
	messages: Message[];
	onSendMessage: (message: string) => void;
	closeChat: () => void;
}

export const Chat = ({
	chatRoom,
	messages,
	closeChat,
	onSendMessage,
}: WaitingRoomProps) => {
	const bgColor = useColorModeValue("gray.100", "gray.700");
	const botBg = useColorModeValue("blue.100", "blue.700");
	const userBg = useColorModeValue("green.100", "green.700");

	const [message, setMessage] = useState("");

	const handleSendMessage = async () => {
		if (!message) return;

		onSendMessage(message);
		setMessage("");
	};

	const messagesEndRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages]);

	return (
		<Box
			w="100%"
			maxW="600px"
			h="90vh"
			m={4}
			borderRadius="lg"
			overflow="hidden"
			boxShadow="xl"
			bg={bgColor}
		>
			<Flex direction="column" h="full">
				<Box
					p={4}
					borderBottomWidth={1}
					bg={useColorModeValue("gray.100", "gray.700")}
					display="flex"
					justifyContent="space-between"
					alignItems="center"
				>
					<Text fontSize="2xl" fontWeight="bold" textAlign="center">
						{chatRoom}
					</Text>
					<Button onClick={closeChat} colorScheme="red" size="sm">
						Close Chat
					</Button>
				</Box>

				<Box
					flex={1}
					overflowY="auto"
					p={4}
					css={{
						"&::-webkit-scrollbar": { width: "8px" },
						"&::-webkit-scrollbar-track": { background: "transparent" },
						"&::-webkit-scrollbar-thumb": {
							borderRadius: "4px",
							background: useColorModeValue("gray.300", "gray.600"),
						},
					}}
				>
					<header>chatRoom</header>

					<VStack saturate={4} align="stretch">
						{messages.map((message, index) => (
							<Flex
								key={index}
								direction={message.author === "Bot" ? "row" : "row-reverse"}
								gap={3}
							>
								<Box
									p={3}
									borderRadius="lg"
									bg={message.author === "Bot" ? botBg : userBg}
									maxWidth="80%"
								>
									<Text fontWeight="bold" mb={1}>
										{message.author}
									</Text>
									<Text>{message.text}</Text>
								</Box>
							</Flex>
						))}

						<div ref={messagesEndRef} />
					</VStack>
				</Box>

				<HStack
					p={4}
					borderTopWidth={1}
					bg={useColorModeValue("white", "gray.800")}
				>
					<Input
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						placeholder="Type a message..."
						onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
						flex={1}
					/>
					<Button
						colorScheme="blue"
						onClick={handleSendMessage}
						px={8}
						flexShrink={0}
					>
						Send
					</Button>
				</HStack>
			</Flex>
		</Box>
	);
};
