import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Terminal } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Landing = () => {
  const navigate = useNavigate();
  const [showStartDialog, setShowStartDialog] = useState(false);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [username, setUsername] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStartSession = async () => {
    if (!username.trim()) {
      toast.error('Please enter your username');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API}/sessions`, {
        host_username: username
      });
      const newSessionId = response.data.session_id;
      toast.success(`Session created: ${newSessionId}`);
      navigate(`/session/${newSessionId}?username=${username}&host=true`);
    } catch (error) {
      console.error('Error creating session:', error);
      toast.error('Failed to create session');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinSession = async () => {
    if (!username.trim()) {
      toast.error('Please enter your username');
      return;
    }
    if (!sessionId.trim()) {
      toast.error('Please enter session ID');
      return;
    }

    setLoading(true);
    try {
      await axios.get(`${API}/sessions/${sessionId}`);
      navigate(`/session/${sessionId}?username=${username}&host=false`);
    } catch (error) {
      console.error('Error joining session:', error);
      toast.error('Session not found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-white p-4 rounded-2xl shadow-lg">
              <Terminal className="w-12 h-12 text-slate-700" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-800 mb-4">
            TermDesk
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Share your terminal with anyone, anywhere. Collaborate in real-time with secure terminal access.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card 
            data-testid="start-session-card"
            className="border-2 hover:border-slate-300 hover:shadow-xl cursor-pointer bg-white backdrop-blur-sm"
            onClick={() => setShowStartDialog(true)}
          >
            <CardHeader>
              <CardTitle className="text-2xl text-slate-800">Start Session</CardTitle>
              <CardDescription className="text-base">
                Create a new terminal sharing session and invite others
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                data-testid="start-session-button"
                className="w-full bg-slate-700 hover:bg-slate-800 text-white py-6 text-lg rounded-xl"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowStartDialog(true);
                }}
              >
                Start New Session
              </Button>
            </CardContent>
          </Card>

          <Card 
            data-testid="join-session-card"
            className="border-2 hover:border-slate-300 hover:shadow-xl cursor-pointer bg-white backdrop-blur-sm"
            onClick={() => setShowJoinDialog(true)}
          >
            <CardHeader>
              <CardTitle className="text-2xl text-slate-800">Join Session</CardTitle>
              <CardDescription className="text-base">
                Enter a session ID to join an existing terminal session
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                data-testid="join-session-button"
                className="w-full bg-slate-600 hover:bg-slate-700 text-white py-6 text-lg rounded-xl"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowJoinDialog(true);
                }}
              >
                Join Existing Session
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Start Session Dialog */}
        <Dialog open={showStartDialog} onOpenChange={setShowStartDialog}>
          <DialogContent data-testid="start-dialog" className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Start New Session</DialogTitle>
              <DialogDescription>
                Enter your username to create a new terminal sharing session
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="start-username">Username</Label>
                <Input
                  data-testid="start-username-input"
                  id="start-username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleStartSession()}
                />
              </div>
              <Button 
                data-testid="start-session-submit"
                className="w-full bg-slate-700 hover:bg-slate-800"
                onClick={handleStartSession}
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Session'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Join Session Dialog */}
        <Dialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
          <DialogContent data-testid="join-dialog" className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Join Session</DialogTitle>
              <DialogDescription>
                Enter your username and the session ID to join
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="join-username">Username</Label>
                <Input
                  data-testid="join-username-input"
                  id="join-username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="session-id">Session ID</Label>
                <Input
                  data-testid="join-session-id-input"
                  id="session-id"
                  placeholder="Enter session ID"
                  value={sessionId}
                  onChange={(e) => setSessionId(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleJoinSession()}
                />
              </div>
              <Button 
                data-testid="join-session-submit"
                className="w-full bg-slate-600 hover:bg-slate-700"
                onClick={handleJoinSession}
                disabled={loading}
              >
                {loading ? 'Joining...' : 'Join Session'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Landing;