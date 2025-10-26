import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { Terminal, Users, Send, Copy, Check, LogOut, Shield, ShieldOff } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const WS_URL = BACKEND_URL.replace('https://', 'wss://').replace('http://', 'ws://');

const Session = () => {
  const { sessionId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const username = searchParams.get('username');
  const isHost = searchParams.get('host') === 'true';

  const [ws, setWs] = useState(null);
  const [members, setMembers] = useState([]);
  const [terminalOutput, setTerminalOutput] = useState([]);
  const [command, setCommand] = useState('');
  const [copied, setCopied] = useState(false);
  const [connected, setConnected] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    // Connect to WebSocket
    const websocket = new WebSocket(
      `${WS_URL}/ws/${sessionId}?username=${username}&is_host=${isHost}`
    );

    websocket.onopen = () => {
      console.log('WebSocket connected');
      setConnected(true);
      toast.success('Connected to session');
    };

    websocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      
      if (message.type === 'welcome') {
        setTerminalOutput(prev => [...prev, {
          type: 'system',
          text: message.message,
          timestamp: new Date()
        }]);
      } else if (message.type === 'member_update') {
        setMembers(message.members);
        if (message.message) {
          setTerminalOutput(prev => [...prev, {
            type: 'system',
            text: message.message,
            timestamp: new Date()
          }]);
        }
      } else if (message.type === 'terminal_output') {
        setTerminalOutput(prev => [...prev, {
          type: 'command',
          command: message.command,
          output: message.output,
          username: message.username,
          timestamp: new Date()
        }]);
      } else if (message.type === 'error') {
        toast.error(message.message);
      }
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      toast.error('Connection error');
    };

    websocket.onclose = () => {
      console.log('WebSocket disconnected');
      setConnected(false);
      toast.info('Disconnected from session');
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

    ws.send(JSON.stringify({
      type: 'execute_command',
      command: command,
      username: username
    }));

    setCommand('');
  };

  const handleGrantPermission = (targetUsername) => {
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    
    ws.send(JSON.stringify({
      type: 'grant_permission',
      username: targetUsername
    }));
    toast.success(`Granted permission to ${targetUsername}`);
  };

  const handleRevokePermission = (targetUsername) => {
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    
    ws.send(JSON.stringify({
      type: 'revoke_permission',
      username: targetUsername
    }));
    toast.success(`Revoked permission from ${targetUsername}`);
  };

  const copySessionId = () => {
    navigator.clipboard.writeText(sessionId);
    setCopied(true);
    toast.success('Session ID copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLeaveSession = () => {
    if (ws) ws.close();
    navigate('/');
  };

  const currentUserPermission = members.find(m => m.username === username)?.has_permission || false;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-slate-100 p-3 rounded-xl">
                <Terminal className="w-6 h-6 text-slate-700" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">TermDesk Session</h1>
                <div className="flex items-center gap-2 mt-1">
                  <code className="text-sm bg-slate-100 px-3 py-1 rounded-lg text-slate-700" data-testid="session-id-display">
                    {sessionId}
                  </code>
                  <Button
                    data-testid="copy-session-id-button"
                    variant="ghost"
                    size="sm"
                    onClick={copySessionId}
                    className="h-7 px-2"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={connected ? 'default' : 'destructive'} data-testid="connection-status">
                {connected ? 'Connected' : 'Disconnected'}
              </Badge>
              {isHost && <Badge variant="secondary" data-testid="host-badge">Host</Badge>}
              <Button 
                data-testid="leave-session-button"
                variant="outline" 
                onClick={handleLeaveSession}
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                Leave
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-4 gap-4">
          {/* Terminal Area */}
          <div className="lg:col-span-3">
            <Card className="bg-white shadow-lg overflow-hidden">
              {/* Terminal Output */}
              <div 
                ref={scrollRef}
                data-testid="terminal-output"
                className="bg-slate-900 text-slate-100 p-6 font-mono text-sm h-[500px] overflow-y-auto"
                style={{ fontFamily: 'Monaco, Courier New, monospace' }}
              >
                {terminalOutput.map((entry, index) => (
                  <div key={index} className="mb-4">
                    {entry.type === 'system' ? (
                      <div className="text-slate-400 italic">
                        [{new Date(entry.timestamp).toLocaleTimeString()}] {entry.text}
                      </div>
                    ) : (
                      <div>
                        <div className="text-green-400">
                          [{new Date(entry.timestamp).toLocaleTimeString()}] {entry.username}@termdesk:~$ {entry.command}
                        </div>
                        <div className="text-slate-200 whitespace-pre-wrap pl-4 mt-1">
                          {entry.output}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {terminalOutput.length === 0 && (
                  <div className="text-slate-500 text-center mt-20">
                    Terminal ready. Start executing commands...
                  </div>
                )}
              </div>

              {/* Command Input */}
              <div className="bg-slate-800 p-4 border-t border-slate-700">
                <div className="flex gap-2">
                  <span className="text-green-400 font-mono pt-2">$</span>
                  <Input
                    data-testid="command-input"
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleExecuteCommand()}
                    placeholder={currentUserPermission ? "Type command and press Enter..." : "You don't have permission to execute commands"}
                    disabled={!currentUserPermission}
                    className="flex-1 bg-slate-700 border-slate-600 text-slate-100 font-mono focus:ring-slate-500"
                  />
                  <Button
                    data-testid="execute-command-button"
                    onClick={handleExecuteCommand}
                    disabled={!command.trim() || !currentUserPermission}
                    className="bg-slate-600 hover:bg-slate-500"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Members Panel */}
          <div className="lg:col-span-1">
            <Card className="bg-white shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-slate-700" />
                <h2 className="text-lg font-semibold text-slate-800">Members</h2>
                <Badge variant="secondary" className="ml-auto" data-testid="member-count">{members.length}</Badge>
              </div>
              <ScrollArea className="h-[500px]">
                <div className="space-y-2" data-testid="members-list">
                  {members.map((member, index) => (
                    <div
                      key={index}
                      data-testid={`member-${member.username}`}
                      className="p-3 bg-slate-50 rounded-lg border border-slate-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-slate-800">{member.username}</span>
                        {member.is_host && (
                          <Badge variant="default" className="text-xs" data-testid={`host-badge-${member.username}`}>
                            Host
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-600">
                          {member.has_permission ? '✓ Can execute' : '✗ View only'}
                        </span>
                        {isHost && !member.is_host && (
                          <Button
                            data-testid={`permission-button-${member.username}`}
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2"
                            onClick={() => 
                              member.has_permission 
                                ? handleRevokePermission(member.username)
                                : handleGrantPermission(member.username)
                            }
                          >
                            {member.has_permission ? (
                              <ShieldOff className="w-4 h-4 text-red-500" />
                            ) : (
                              <Shield className="w-4 h-4 text-green-500" />
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
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