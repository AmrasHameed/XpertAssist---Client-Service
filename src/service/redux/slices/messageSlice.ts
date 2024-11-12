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
            state.messages.push(action.payload);  
        },
        removeMessage: (state) =>{
            state.messages = []
        }
    },
});

export const { addMessage, removeMessage } = messagesSlice.actions;

export default messagesSlice;
