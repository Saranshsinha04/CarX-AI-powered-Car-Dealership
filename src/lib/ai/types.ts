import { z } from "zod";

export type Role = "user" | "assistant" | "system" | "tool";

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  toolCalls?: ToolCall[];
  toolResults?: ToolResult[];
  matchedVehicles?: any[];
  leadCaptured?: boolean;
  createdAt?: string;
}

export interface ToolCall {
  id: string;
  toolName: string;
  parameters: Record<string, any>;
}

export interface ToolResult {
  toolCallId: string;
  toolName: string;
  result: any;
  error?: string;
}

export interface AiToolDefinition {
  name: string;
  description: string;
  roleRequired?: "PUBLIC" | "CUSTOMER" | "STAFF" | "ADMIN";
  parametersSchema: z.ZodType<any>;
  execute: (params: any, context: AiExecutionContext) => Promise<any>;
}

export interface AiExecutionContext {
  dealershipId: string;
  userRole?: string;
  userId?: string;
  sessionId?: string;
}

export interface AiResponsePayload {
  message: string;
  matchedVehicles?: any[];
  suggestedActions?: Array<{
    label: string;
    action: string;
    payload?: any;
  }>;
  leadCaptured?: boolean;
  leadSummary?: string;
}
