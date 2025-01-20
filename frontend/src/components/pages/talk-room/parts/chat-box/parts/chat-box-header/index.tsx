import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shared/ui-elements/avatar";

export const ChatBoxHeader = () => {
  return (
    <div className="flex items-center space-x-4">
      <Avatar className="h-12 w-12">
        <AvatarImage src="/images/AI就活エージェント.png" alt="AI Agent" />
        <AvatarFallback>AI</AvatarFallback>
      </Avatar>
      <div>
        <h2 className="text-xl font-semibold">AIキャリア・アドバイザー</h2>
        <p className="text-sm text-muted-foreground">オンライン</p>
      </div>
    </div>
  );
};
