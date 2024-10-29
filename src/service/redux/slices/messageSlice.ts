import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Message {
    sender: 'user' | 'expert';
    content: string;
}

interface MessagesState {
    messages: Message[]; 
}

const initialState: MessagesState = {
    messages: [],
};

export const messagesSlice = createSlice({
    name: "messages",
    initialState,
    reducers: {
        addMessage: (state, action: PayloadAction<Message>) => {
            state.messages.push(action.payload);  // Add new message to the array
        },
    },
});

export const { addMessage } = messagesSlice.actions;

export default messagesSlice;
