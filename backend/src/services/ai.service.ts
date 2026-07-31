import { GoogleGenAI } from "@google/genai";
import { RepositoryFile } from "../models/RepositoryFile.js";
import { Repository } from "../models/Repository.js";
import { Branch } from "../models/Branch.js";

// Initialize Gemini
// We assume process.env.GEMINI_API_KEY is set
const ai = new GoogleGenAI({});

export const aiService = {
  /**
   * Concatenate file contents of a branch into a single string for AI context
   */
  async getBranchCodeContext(repositoryId: string, branchName: string): Promise<string> {
    const branch = await Branch.findOne({ repository: repositoryId, name: branchName });
    if (!branch) return "";

    const files = await RepositoryFile.find({ 
      repository: repositoryId, 
      branch: branch._id,
      type: "file"
    });

    if (files.length === 0) return "No files in this branch.";

    let context = "Here is the current codebase for the branch:\n\n";
    for (const file of files) {
      // Only include non-empty, reasonably sized text files
      if (file.content && file.content.length > 0 && file.content.length < 50000) {
        context += `--- File: ${file.parentPath === "/" ? "" : file.parentPath + "/"}${file.name} ---\n`;
        context += `${file.content}\n\n`;
      }
    }
    return context;
  },

  /**
   * Generate a PR description based on branch code
   */
  async generatePRDescription(repositoryId: string, branchName: string): Promise<{ title: string; description: string }> {
    try {
      const codeContext = await this.getBranchCodeContext(repositoryId, branchName);
      
      const prompt = `
      You are an expert senior software engineer. Based on the following codebase from a feature branch, write a great Pull Request title and description.
      
      Format your response exactly like this:
      TITLE: <suggested concise title>
      DESCRIPTION: 
      <markdown description explaining what changes were likely made, why they are important, and a brief overview of the code structure>
      
      Codebase:
      ${codeContext}
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      
      const text = response.text || "";
      const titleMatch = text.match(/TITLE:\s*(.*)/);
      const descMatch = text.split(/DESCRIPTION:\s*/);
      
      return {
        title: titleMatch ? titleMatch[1].trim() : "AI Suggested PR",
        description: descMatch.length > 1 ? descMatch[1].trim() : "Description could not be generated.",
      };
    } catch (error) {
      console.error("AI Error:", error);
      return { title: "Error generating PR", description: "Failed to reach AI service." };
    }
  },

  /**
   * Review a PR
   */
  async generatePRReview(repositoryId: string, branchName: string, title: string, description: string): Promise<{ status: "Approved" | "Changes Requested", comment: string }> {
    try {
      const codeContext = await this.getBranchCodeContext(repositoryId, branchName);
      
      const prompt = `
      You are a strict but helpful senior engineer reviewing a Pull Request.
      PR Title: ${title}
      PR Description: ${description}
      
      Here is the codebase from the branch:
      ${codeContext}
      
      Please review this code. Look for bugs, best practice violations, or missing error handling.
      If the code looks solid, approve it. If there are glaring issues, request changes.
      
      Format your response exactly like this:
      STATUS: <Approved or Changes Requested>
      COMMENT:
      <Your detailed markdown review comments>
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const text = response.text || "";
      const statusMatch = text.match(/STATUS:\s*(Approved|Changes Requested)/i);
      const commentMatch = text.split(/COMMENT:\s*/i);

      let status: "Approved" | "Changes Requested" = "Approved";
      if (statusMatch && statusMatch[1].toLowerCase().includes("changes requested")) {
        status = "Changes Requested";
      }

      return {
        status,
        comment: commentMatch.length > 1 ? commentMatch[1].trim() : "LGTM!",
      };
    } catch (error) {
      console.error("AI Error:", error);
      return { status: "Approved", comment: "AI Review failed due to an error, falling back to Approved." };
    }
  },

  /**
   * Generate a commit message based on branch code
   */
  async generateCommitMessage(repositoryId: string, branchName: string): Promise<string> {
    try {
      const codeContext = await this.getBranchCodeContext(repositoryId, branchName);
      const prompt = `You are an expert developer. Generate a concise, conventional commit message based on this codebase context. Only return the commit message string, nothing else. Context:\n${codeContext}`;
      const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
      return response.text?.trim() || "chore: update files";
    } catch (e) {
      return "chore: update files";
    }
  },

  /**
   * Handle global AI Chat interactions with context of all repositories
   */
  async chat(userId: string, message: string, history: { role: string, content: string }[]): Promise<string> {
    try {
      const repos: any[] = await Repository.find({ owner: userId });
      let systemPrompt = "You are ForgeOps AI, an expert developer assistant. The user owns the following repositories. Help them answer questions or review code based on this context.\n\n";
      
      for (const repo of repos) {
        systemPrompt += `--- Repository: ${repo.name} ---\nDescription: ${repo.description || "N/A"}\n`;
        const branch: any = await Branch.findOne({ repository: repo._id, isDefault: true });
        if (branch) {
          const codeContext = await this.getBranchCodeContext(repo._id.toString(), branch.name);
          if (codeContext && codeContext !== "No files in this branch.") {
            systemPrompt += `Codebase:\n${codeContext}\n\n`;
          }
        }
      }

      let conversation = systemPrompt + "\n\n--- Chat History ---\n";
      if (history && history.length > 0) {
        for (const msg of history) {
          conversation += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n\n`;
        }
      }
      conversation += `User: ${message}\nAssistant: `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: conversation,
      });

      return response.text?.trim() || "I'm sorry, I couldn't process that request.";
    } catch (error: any) {
      console.error("AI Chat Error:", error);
      return `I'm experiencing some technical difficulties. Error: ${error.message}`;
    }
  }
};
