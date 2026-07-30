import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export default function GitHubCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const processed = useRef(false);

  useEffect(() => {
    const code = searchParams.get("code");
    
    if (!code) {
      toast.error("No authorization code provided by GitHub.");
      navigate("/login");
      return;
    }

    if (processed.current) return;
    processed.current = true;

    async function processGitHubLogin() {
      try {
        const response = await authService.githubLogin(code as string);
        login(response.token, response.user);
        toast.success("Successfully logged in with GitHub!");
        navigate("/");
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to authenticate with GitHub");
        navigate("/login");
      }
    }

    processGitHubLogin();
  }, [searchParams, navigate, login]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <h2 className="text-xl font-medium">Authenticating with GitHub...</h2>
      </div>
    </div>
  );
}
