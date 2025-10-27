import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import {
  Terminal,
  Zap,
  Shield,
  Users,
  ChevronRight,
  Lock,
  Cpu,
} from "lucide-react";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Landing = () => {
  const navigate = useNavigate();
  const [showStartDialog, setShowStartDialog] = useState(false);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [username, setUsername] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleStartSession = async () => {
    if (!username.trim()) {
      toast.error("Please enter your username");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API}/sessions`, {
        host_username: username,
      });
      const newSessionId = response.data.session_id;
      toast.success(`Session created: ${newSessionId}`);
      navigate(`/session/${newSessionId}?username=${username}&host=true`);
    } catch (error) {
      console.error("Error creating session:", error);
      toast.error("Failed to create session");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinSession = async () => {
    if (!username.trim()) {
      toast.error("Please enter your username");
      return;
    }
    if (!sessionId.trim()) {
      toast.error("Please enter session ID");
      return;
    }

    setLoading(true);
    try {
      await axios.get(`${API}/sessions/${sessionId}`);
      navigate(`/session/${sessionId}?username=${username}&host=false`);
    } catch (error) {
      console.error("Error joining session:", error);
      toast.error("Session not found");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 matrix-bg grid-pattern">
      <div className="w-full max-w-6xl">
        {/* ASCII Art Header */}
        <div className="text-center mb-12 animate-slide-up scanline">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 terminal-glow-strong animate-pulse"></div>
              <div className="relative terminal-panel p-6 rounded-lg">
                <Terminal
                  className="w-12 h-12 sm:w-16 sm:h-16 text-terminal-bright"
                  strokeWidth={2}
                />
              </div>
            </div>
          </div>

          <div className="mb-6 overflow-x-auto">
            <pre className="text-terminal-bright font-bold text-[0.5rem] sm:text-xs md:text-sm lg:text-base tracking-wider text-shadow-terminal-strong inline-block whitespace-pre">
              {`████████╗███████╗██████╗ ███╗   ███╗██████╗ ███████╗███████╗██╗  ██╗
╚══██╔══╝██╔════╝██╔══██╗████╗ ████║██╔══██╗██╔════╝██╔════╝██║ ██╔╝
   ██║   █████╗  ██████╔╝██╔████╔██║██║  ██║█████╗  ███████╗█████╔╝
   ██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║██║  ██║██╔══╝  ╚════██║██╔═██╗
   ██║   ███████╗██║  ██║██║ ╚═╝ ██║██████╔╝███████╗███████║██║  ██╗
   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝`}
            </pre>
          </div>

          <p className="text-base sm:text-lg lg:text-xl text-terminal font-mono max-w-3xl mx-auto mb-6 leading-relaxed text-shadow-terminal">
            <span className="text-terminal-bright">&gt;</span> Share your
            terminal with anyone, anywhere.
            <br />
            <span className="text-terminal-bright">&gt;</span> Real-time
            collaboration. Maximum security.
            <span className="typing-cursor"></span>
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            <div className="terminal-border px-4 py-2 rounded bg-black/80">
              <div className="flex items-center gap-2 text-terminal font-mono text-sm">
                <Zap className="w-4 h-4 text-terminal-bright" />
                <span>REAL-TIME</span>
              </div>
            </div>
            <div className="terminal-border px-4 py-2 rounded bg-black/80">
              <div className="flex items-center gap-2 text-terminal font-mono text-sm">
                <Lock className="w-4 h-4 text-terminal-bright" />
                <span>ENCRYPTED</span>
              </div>
            </div>
            <div className="terminal-border px-4 py-2 rounded bg-black/80">
              <div className="flex items-center gap-2 text-terminal font-mono text-sm">
                <Cpu className="w-4 h-4 text-terminal-bright" />
                <span>LOW-LATENCY</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 animate-scale-in">
          {/* Start Session Card */}
          <Card
            data-testid="start-session-card"
            className="group terminal-panel-dark hover:terminal-glow transition-all duration-300 cursor-pointer bg-black/95"
            onClick={() => setShowStartDialog(true)}
          >
            <CardHeader className="relative z-10 pb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="terminal-border p-3 rounded bg-black group-hover:terminal-glow transition-all duration-300">
                  <Terminal className="w-6 h-6 text-terminal-bright" />
                </div>
                <ChevronRight className="w-5 h-5 text-terminal-dim group-hover:text-terminal-bright group-hover:translate-x-1 transition-all duration-300" />
              </div>
              <CardTitle className="text-2xl sm:text-3xl text-terminal-bright mb-2 font-mono font-bold tracking-wide text-shadow-terminal">
                [ START_SESSION ]
              </CardTitle>
              <CardDescription className="text-base text-terminal-dim font-mono leading-relaxed">
                <span className="text-terminal-bright">&gt;</span> Initialize
                new terminal session
                <br />
                <span className="text-terminal-bright">&gt;</span> Grant access
                to collaborators
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <Button
                data-testid="start-session-button"
                className="w-full terminal-button h-12 text-base font-mono font-bold tracking-wider rounded border-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowStartDialog(true);
                }}
              >
                <Terminal className="w-5 h-5 mr-2" />
                INITIALIZE SESSION
              </Button>
            </CardContent>
          </Card>

          {/* Join Session Card */}
          <Card
            data-testid="join-session-card"
            className="group terminal-panel-dark hover:terminal-glow transition-all duration-300 cursor-pointer bg-black/95"
            onClick={() => setShowJoinDialog(true)}
          >
            <CardHeader className="relative z-10 pb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="terminal-border p-3 rounded bg-black group-hover:terminal-glow transition-all duration-300">
                  <Users className="w-6 h-6 text-terminal-bright" />
                </div>
                <ChevronRight className="w-5 h-5 text-terminal-dim group-hover:text-terminal-bright group-hover:translate-x-1 transition-all duration-300" />
              </div>
              <CardTitle className="text-2xl sm:text-3xl text-terminal-bright mb-2 font-mono font-bold tracking-wide text-shadow-terminal">
                [ JOIN_SESSION ]
              </CardTitle>
              <CardDescription className="text-base text-terminal-dim font-mono leading-relaxed">
                <span className="text-terminal-bright">&gt;</span> Connect to
                existing session
                <br />
                <span className="text-terminal-bright">&gt;</span> Enter session
                identifier
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <Button
                data-testid="join-session-button"
                className="w-full terminal-button h-12 text-base font-mono font-bold tracking-wider rounded border-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowJoinDialog(true);
                }}
              >
                <Users className="w-5 h-5 mr-2" />
                CONNECT TO SESSION
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 animate-fade-in">
          <p className="text-terminal-dim font-mono text-sm">
            <span className="text-terminal-bright blink">█</span> System ready.
            Awaiting input...
          </p>
        </div>

        {/* Start Session Dialog */}
        <Dialog open={showStartDialog} onOpenChange={setShowStartDialog}>
          <DialogContent
            data-testid="start-dialog"
            className="sm:max-w-md terminal-panel bg-black text-terminal"
          >
            <DialogHeader>
              <DialogTitle className="text-xl font-mono font-bold flex items-center gap-3 text-terminal-bright text-shadow-terminal">
                <div className="terminal-border p-2 rounded bg-black">
                  <Terminal className="w-5 h-5" />
                </div>
                [ INITIALIZE NEW SESSION ]
              </DialogTitle>
              <DialogDescription className="text-sm text-terminal-dim font-mono mt-3">
                <span className="text-terminal-bright">&gt;</span> Enter your
                username to create a new terminal sharing session
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-5 py-4">
              <div className="space-y-2">
                <Label
                  htmlFor="start-username"
                  className="text-sm font-mono font-bold text-terminal tracking-wide"
                >
                  USERNAME:
                </Label>
                <Input
                  data-testid="start-username-input"
                  id="start-username"
                  placeholder="user@termdesk"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleStartSession()}
                  className="h-11 font-mono bg-black border-2 border-[#00ff41] text-terminal focus:ring-2 focus:ring-[#00ff41] focus:border-[#00ff41] placeholder:text-terminal-dim"
                  autoFocus
                />
              </div>
              <Button
                data-testid="start-session-submit"
                className="w-full terminal-button h-11 font-mono font-bold tracking-wider rounded border-2"
                onClick={handleStartSession}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-terminal border-t-transparent rounded-full animate-spin mr-2"></div>
                    INITIALIZING...
                  </>
                ) : (
                  <>
                    <Terminal className="w-4 h-4 mr-2" />
                    CREATE SESSION
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Join Session Dialog */}
        <Dialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
          <DialogContent
            data-testid="join-dialog"
            className="sm:max-w-md terminal-panel bg-black text-terminal"
          >
            <DialogHeader>
              <DialogTitle className="text-xl font-mono font-bold flex items-center gap-3 text-terminal-bright text-shadow-terminal">
                <div className="terminal-border p-2 rounded bg-black">
                  <Users className="w-5 h-5" />
                </div>
                [ CONNECT TO SESSION ]
              </DialogTitle>
              <DialogDescription className="text-sm text-terminal-dim font-mono mt-3">
                <span className="text-terminal-bright">&gt;</span> Enter your
                username and session identifier
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-5 py-4">
              <div className="space-y-2">
                <Label
                  htmlFor="join-username"
                  className="text-sm font-mono font-bold text-terminal tracking-wide"
                >
                  USERNAME:
                </Label>
                <Input
                  data-testid="join-username-input"
                  id="join-username"
                  placeholder="user@termdesk"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-11 font-mono bg-black border-2 border-[#00ff41] text-terminal focus:ring-2 focus:ring-[#00ff41] focus:border-[#00ff41] placeholder:text-terminal-dim"
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="session-id"
                  className="text-sm font-mono font-bold text-terminal tracking-wide"
                >
                  SESSION_ID:
                </Label>
                <Input
                  data-testid="join-session-id-input"
                  id="session-id"
                  placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  value={sessionId}
                  onChange={(e) => setSessionId(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleJoinSession()}
                  className="h-11 font-mono bg-black border-2 border-[#00ff41] text-terminal focus:ring-2 focus:ring-[#00ff41] focus:border-[#00ff41] placeholder:text-terminal-dim"
                />
              </div>
              <Button
                data-testid="join-session-submit"
                className="w-full terminal-button h-11 font-mono font-bold tracking-wider rounded border-2"
                onClick={handleJoinSession}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-terminal border-t-transparent rounded-full animate-spin mr-2"></div>
                    CONNECTING...
                  </>
                ) : (
                  <>
                    <Users className="w-4 h-4 mr-2" />
                    JOIN SESSION
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Landing;
