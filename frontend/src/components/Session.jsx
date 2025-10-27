import { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import {
  Terminal,
  Users,
  Send,
  Copy,
  Check,
  LogOut,
  Shield,
  ShieldOff,
  Zap,
  Activity,
  Power,
  Cpu,
} from "lucide-react";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const WS_URL = BACKEND_URL.replace("https://", "wss://").replace(
  "http://",
  "ws://",
);

const Session = () => {
  const { sessionId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const username = searchParams.get("username");
  const isHost = searchParams.get("host") === "true";

  const [ws, setWs] = useState(null);
  const [members, setMembers] = useState([]);
  const [terminalOutput, setTerminalOutput] = useState([]);
  const [command, setCommand] = useState("");
  const [copied, setCopied] = useState(false);
  const [connected, setConnected] = useState(false);
  const scrollRef = useRef(null);
  const commandInputRef = useRef(null);

  useEffect(() => {
    // Connect to WebSocket
    const websocket = new WebSocket(
      `${WS_URL}/api/ws/${sessionId}?username=${username}&is_host=${isHost}`,
    );

    websocket.onopen = () => {
      console.log("WebSocket connected");
      setConnected(true);
      toast.success("Connected to session");
    };

    websocket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === "welcome") {
        setTerminalOutput((prev) => [
          ...prev,
          {
            type: "system",
            text: message.message,
            timestamp: new Date(),
          },
        ]);
      } else if (message.type === "member_update") {
        setMembers(message.members);
        if (message.message) {
          setTerminalOutput((prev) => [
            ...prev,
            {
              type: "system",
              text: message.message,
              timestamp: new Date(),
            },
          ]);
        }
      } else if (message.type === "terminal_output") {
        setTerminalOutput((prev) => [
          ...prev,
          {
            type: "command",
            command: message.command,
            output: message.output,
            username: message.username,
            timestamp: new Date(),
          },
        ]);
      } else if (message.type === "error") {
        toast.error(message.message);
      }
    };

    websocket.onerror = (error) => {
      console.error("WebSocket error:", error);
      toast.error("Connection error");
    };

    websocket.onclose = () => {
      console.log("WebSocket disconnected");
      setConnected(false);
      toast.info("Disconnected from session");
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, [sessionId, username, isHost]);

  useEffect(() => {
    // Auto-scroll to bottom
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [terminalOutput]);

  const handleExecuteCommand = () => {
    if (!command.trim() || !ws || ws.readyState !== WebSocket.OPEN) return;

    ws.send(
      JSON.stringify({
        type: "execute_command",
        command: command,
        username: username,
      }),
    );

    setCommand("");
  };

  const handleGrantPermission = (targetUsername) => {
    if (!ws || ws.readyState !== WebSocket.OPEN) return;

    ws.send(
      JSON.stringify({
        type: "grant_permission",
        username: targetUsername,
      }),
    );
    toast.success(`Granted permission to ${targetUsername}`);
  };

  const handleRevokePermission = (targetUsername) => {
    if (!ws || ws.readyState !== WebSocket.OPEN) return;

    ws.send(
      JSON.stringify({
        type: "revoke_permission",
        username: targetUsername,
      }),
    );
    toast.success(`Revoked permission from ${targetUsername}`);
  };

  const copySessionId = () => {
    navigator.clipboard.writeText(sessionId);
    setCopied(true);
    toast.success("Session ID copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLeaveSession = () => {
    if (ws) ws.close();
    navigate("/");
  };

  const currentUserPermission =
    members.find((m) => m.username === username)?.has_permission || false;

  return (
    <div className="min-h-screen p-3 sm:p-4 lg:p-6 matrix-bg scanline">
      <div className="max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="terminal-panel rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 animate-slide-up">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-col sm:flex-row w-full lg:w-auto">
              <div className="relative">
                <div className="absolute inset-0 terminal-glow-strong animate-pulse"></div>
                <div className="relative terminal-border p-2.5 sm:p-3 rounded bg-black">
                  <Terminal className="w-5 h-5 sm:w-7 sm:h-7 text-terminal-bright" />
                </div>
              </div>
              <div className="flex-1 w-full sm:w-auto">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-mono font-bold text-terminal-bright mb-2 flex items-center gap-2 text-shadow-terminal-strong">
                  <span>[ TERMDESK_SESSION ]</span>
                  <Activity className="w-5 h-5 text-terminal-bright animate-pulse" />
                </h1>
                <div className="flex flex-wrap items-center gap-2">
                  <code
                    className="text-xs sm:text-sm terminal-border px-3 sm:px-4 py-1.5 sm:py-2 rounded bg-black/90 text-terminal font-mono shadow-lg"
                    data-testid="session-id-display"
                  >
                    {sessionId}
                  </code>
                  <Button
                    data-testid="copy-session-id-button"
                    variant="ghost"
                    size="sm"
                    onClick={copySessionId}
                    className="h-7 sm:h-8 px-2 sm:px-3 terminal-border bg-black text-terminal hover:bg-[#00ff41] hover:text-black transition-all duration-300 font-mono"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full lg:w-auto justify-start lg:justify-end">
              <Badge
                variant={connected ? "default" : "destructive"}
                data-testid="connection-status"
                className={`${
                  connected
                    ? "bg-[#00ff41] text-black border-[#00ff41]"
                    : "bg-red-500 text-black border-red-500"
                } border-2 px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-mono font-bold shadow-lg`}
              >
                <div
                  className={`w-2 h-2 rounded-full mr-2 ${
                    connected ? "bg-black animate-pulse" : "bg-black"
                  }`}
                ></div>
                {connected ? "ONLINE" : "OFFLINE"}
              </Badge>
              {isHost && (
                <Badge
                  variant="secondary"
                  data-testid="host-badge"
                  className="bg-black text-terminal border-2 border-[#00ff41] px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-mono font-bold shadow-lg"
                >
                  <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5" />
                  HOST
                </Badge>
              )}
              <Button
                data-testid="leave-session-button"
                variant="outline"
                onClick={handleLeaveSession}
                className="gap-1.5 sm:gap-2 bg-black text-red-500 border-2 border-red-500 hover:bg-red-500 hover:text-black px-3 sm:px-4 h-8 sm:h-9 text-xs sm:text-sm font-mono font-bold transition-all duration-300"
              >
                <Power className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">EXIT</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Terminal Area */}
          <div className="lg:col-span-3 order-2 lg:order-1 animate-scale-in">
            <Card className="terminal-panel overflow-hidden bg-black">
              {/* Terminal Header */}
              <div className="bg-black border-b-2 border-[#00ff41] px-4 sm:px-6 py-3 sm:py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="text-terminal font-mono text-xs sm:text-sm font-bold flex items-center gap-2">
                      <Cpu className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-terminal-bright" />
                      <span className="hidden sm:inline">TERMINAL_OUTPUT</span>
                      <span className="sm:hidden">TERM</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-terminal font-mono text-xs">
                    <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-terminal-bright animate-pulse" />
                    <span className="hidden sm:inline">LIVE</span>
                  </div>
                </div>
              </div>

              {/* Terminal Output */}
              <div
                ref={scrollRef}
                data-testid="terminal-output"
                className="bg-black text-terminal p-4 sm:p-6 font-mono text-xs sm:text-sm h-[400px] sm:h-[500px] lg:h-[600px] overflow-y-auto scrollbar-terminal crt-effect"
                style={{
                  fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                }}
              >
                {terminalOutput.map((entry, index) => (
                  <div
                    key={index}
                    className="mb-3 sm:mb-4 fade-in"
                    style={{ animationDelay: `${index * 0.02}s` }}
                  >
                    {entry.type === "system" ? (
                      <div className="flex items-start gap-2 text-terminal-dim bg-[#00ff41]/5 px-3 py-2 rounded border-l-2 border-terminal">
                        <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0 text-terminal-bright" />
                        <div className="flex-1">
                          <span className="text-terminal-dim text-xs">
                            [{new Date(entry.timestamp).toLocaleTimeString()}]
                          </span>{" "}
                          {entry.text}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1 sm:space-y-2">
                        <div className="flex items-start gap-2 text-terminal-bright font-semibold bg-[#00ff41]/5 px-3 py-2 rounded border-l-2 border-terminal-bright">
                          <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 break-all">
                            <span className="text-terminal-dim text-xs">
                              [{new Date(entry.timestamp).toLocaleTimeString()}]
                            </span>{" "}
                            <span className="text-terminal-bright">
                              {entry.username}
                            </span>
                            <span className="text-terminal">@termdesk</span>
                            <span className="text-terminal-bright">
                              :~$
                            </span>{" "}
                            <span className="text-terminal">
                              {entry.command}
                            </span>
                          </div>
                        </div>
                        <div className="text-terminal whitespace-pre-wrap pl-3 sm:pl-6 text-xs sm:text-sm leading-relaxed bg-black/50 px-3 py-2 rounded border-l border-terminal-dim">
                          {entry.output || (
                            <span className="text-terminal-dim italic">
                              [no output]
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {terminalOutput.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-terminal-dim">
                    <Terminal className="w-12 h-12 sm:w-16 sm:h-16 mb-4 opacity-30" />
                    <p className="text-base sm:text-lg font-bold mb-2 font-mono">
                      TERMINAL_READY
                    </p>
                    <p className="text-xs sm:text-sm opacity-70 font-mono">
                      &gt; Awaiting commands...
                      <span className="blink">█</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Command Input */}
              <div className="bg-black border-t-2 border-[#00ff41] p-3 sm:p-4">
                <div className="flex gap-2 sm:gap-3">
                  <span className="text-terminal-bright font-mono text-base sm:text-lg pt-2 sm:pt-2.5 font-bold flex-shrink-0">
                    &gt;
                  </span>
                  <Input
                    ref={commandInputRef}
                    data-testid="command-input"
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleExecuteCommand()
                    }
                    placeholder={
                      currentUserPermission
                        ? "type command..."
                        : "access denied: no permission"
                    }
                    disabled={!currentUserPermission}
                    className="flex-1 bg-black border-2 border-[#00ff41] focus:border-terminal-bright text-terminal placeholder:text-terminal-dim font-mono text-sm sm:text-base h-10 sm:h-11 focus:ring-2 focus:ring-[#00ff41] transition-all duration-300"
                  />
                  <Button
                    data-testid="execute-command-button"
                    onClick={handleExecuteCommand}
                    disabled={!command.trim() || !currentUserPermission}
                    className="terminal-button h-10 sm:h-11 px-3 sm:px-5 font-mono font-bold border-2"
                  >
                    <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                </div>
                {!currentUserPermission && (
                  <div className="mt-3 flex items-center gap-2 text-terminal-dim text-xs bg-[#00ff41]/10 px-3 py-2 rounded border border-terminal-dim font-mono">
                    <Shield className="w-3.5 h-3.5 flex-shrink-0 text-terminal-bright" />
                    <span>
                      ACCESS_DENIED: Request permission from host to execute
                      commands
                    </span>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Members Panel */}
          <div className="lg:col-span-1 order-1 lg:order-2 animate-scale-in">
            <Card className="terminal-panel overflow-hidden bg-black">
              <div className="bg-black border-b-2 border-[#00ff41] p-4 sm:p-6">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="terminal-border p-2 rounded bg-black">
                      <Users className="w-4 h-4 sm:w-5 sm:h-5 text-terminal-bright" />
                    </div>
                    <h2 className="text-lg sm:text-xl font-mono font-bold text-terminal-bright text-shadow-terminal">
                      USERS
                    </h2>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-black text-terminal border-2 border-terminal px-2.5 sm:px-3 py-1 font-mono font-bold"
                    data-testid="member-count"
                  >
                    {members.length}
                  </Badge>
                </div>
                <p className="text-terminal-dim text-xs sm:text-sm font-mono">
                  &gt; connected_users
                </p>
              </div>
              <ScrollArea className="h-[400px] sm:h-[500px] lg:h-[600px]">
                <div
                  className="space-y-2 sm:space-y-3 p-3 sm:p-4 bg-black"
                  data-testid="members-list"
                >
                  {members.map((member, index) => (
                    <div
                      key={index}
                      data-testid={`member-${member.username}`}
                      className="group terminal-border p-3 sm:p-4 rounded bg-black/80 hover:bg-[#00ff41]/5 hover:terminal-glow transition-all duration-300 animate-slide-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-center justify-between mb-2 sm:mb-3">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <div
                            className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full flex-shrink-0 ${
                              member.has_permission
                                ? "bg-terminal-bright terminal-glow animate-pulse"
                                : "bg-terminal-dim"
                            }`}
                          ></div>
                          <span className="font-mono font-bold text-terminal text-sm sm:text-base truncate">
                            {member.username}
                          </span>
                        </div>
                        {member.is_host && (
                          <Badge
                            variant="default"
                            className="text-xs bg-black text-terminal-bright border-2 border-terminal-bright px-2 sm:px-2.5 py-0.5 font-mono font-bold"
                            data-testid={`host-badge-${member.username}`}
                          >
                            HOST
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          {member.has_permission ? (
                            <div className="flex items-center gap-1.5 text-terminal-bright text-xs font-mono font-bold bg-[#00ff41]/10 px-2 sm:px-2.5 py-1 rounded border border-terminal">
                              <Shield className="w-3 h-3 flex-shrink-0" />
                              <span className="hidden sm:inline">EXECUTE</span>
                              <span className="sm:hidden">EXE</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-terminal-dim text-xs font-mono font-bold bg-black/50 px-2 sm:px-2.5 py-1 rounded border border-terminal-dim">
                              <ShieldOff className="w-3 h-3 flex-shrink-0" />
                              <span className="hidden sm:inline">VIEW</span>
                              <span className="sm:hidden">V</span>
                            </div>
                          )}
                        </div>
                        {isHost && !member.is_host && (
                          <Button
                            data-testid={`permission-button-${member.username}`}
                            variant="ghost"
                            size="sm"
                            className="h-7 sm:h-8 px-2 sm:px-3 terminal-border bg-black hover:bg-[#00ff41] hover:text-black transition-all duration-300 text-terminal font-mono"
                            onClick={() =>
                              member.has_permission
                                ? handleRevokePermission(member.username)
                                : handleGrantPermission(member.username)
                            }
                          >
                            {member.has_permission ? (
                              <ShieldOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            ) : (
                              <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  {members.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-terminal-dim">
                      <Users className="w-12 h-12 sm:w-16 sm:h-16 mb-4 opacity-30" />
                      <p className="text-sm sm:text-base font-mono font-bold">
                        NO_USERS
                      </p>
                      <p className="text-xs mt-2 font-mono">
                        &gt; awaiting connections...
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Session;
