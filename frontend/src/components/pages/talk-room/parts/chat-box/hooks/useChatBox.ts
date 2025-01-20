import { useEffect } from "react";

interface UseChatBoxProps {
  userId: string;
  fetchMessages: (userId: string) => Promise<void>;
}

export const useChatBox = ({ userId, fetchMessages }: UseChatBoxProps) => {
  useEffect(() => {
    void fetchMessages(userId);
  }, []);

  return {};
};
