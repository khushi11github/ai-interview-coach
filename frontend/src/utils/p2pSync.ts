export class WebRTCSync {
  pc: RTCPeerConnection;
  dc: RTCDataChannel | null = null;
  onMessageCallback: ((data: any) => void) | null = null;
  onConnectionChangeCallback: ((status: string) => void) | null = null;

  constructor() {
    const config = {
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    };
    this.pc = new RTCPeerConnection(config);
    this.pc.onconnectionstatechange = () => {
      if (this.onConnectionChangeCallback) {
        this.onConnectionChangeCallback(this.pc.connectionState);
      }
    };
  }

  async createOffer(): Promise<string> {
    this.dc = this.pc.createDataChannel('sync');
    this.setupDataChannel(this.dc);

    const offer = await this.pc.createOffer();
    await this.pc.setLocalDescription(offer);

    // Wait for ICE gathering to complete
    await new Promise<void>((resolve) => {
      if (this.pc.iceGatheringState === 'complete') {
        resolve();
      } else {
        const check = () => {
          if (this.pc.iceGatheringState === 'complete') {
            this.pc.removeEventListener('icegatheringstatechange', check);
            resolve();
          }
        };
        this.pc.addEventListener('icegatheringstatechange', check);
      }
    });

    return btoa(JSON.stringify(this.pc.localDescription));
  }

  async acceptOfferAndCreateAnswer(offerStr: string): Promise<string> {
    this.pc.ondatachannel = (e) => {
      this.dc = e.channel;
      this.setupDataChannel(this.dc);
    };

    try {
      const offerDesc = JSON.parse(atob(offerStr));
      await this.pc.setRemoteDescription(new RTCSessionDescription(offerDesc));

      const answer = await this.pc.createAnswer();
      await this.pc.setLocalDescription(answer);

      // Wait for ICE gathering
      await new Promise<void>((resolve) => {
        if (this.pc.iceGatheringState === 'complete') {
          resolve();
        } else {
          const check = () => {
            if (this.pc.iceGatheringState === 'complete') {
              this.pc.removeEventListener('icegatheringstatechange', check);
              resolve();
            }
          };
          this.pc.addEventListener('icegatheringstatechange', check);
        }
      });

      return btoa(JSON.stringify(this.pc.localDescription));
    } catch (err) {
      console.error('Failed to parse offer or create answer:', err);
      throw new Error('Invalid Offer token');
    }
  }

  async setAnswer(answerStr: string) {
    try {
      const answerDesc = JSON.parse(atob(answerStr));
      await this.pc.setRemoteDescription(new RTCSessionDescription(answerDesc));
    } catch (err) {
      console.error('Failed to parse or set answer:', err);
      throw new Error('Invalid Answer token');
    }
  }

  setupDataChannel(dc: RTCDataChannel) {
    dc.onopen = () => {
      if (this.onConnectionChangeCallback) {
        this.onConnectionChangeCallback('connected');
      }
    };
    dc.onclose = () => {
      if (this.onConnectionChangeCallback) {
        this.onConnectionChangeCallback('disconnected');
      }
    };
    dc.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (this.onMessageCallback) this.onMessageCallback(data);
      } catch (err) {
        console.error('Error parsing data channel message:', err);
      }
    };
  }

  send(data: any) {
    if (this.dc && this.dc.readyState === 'open') {
      this.dc.send(JSON.stringify(data));
    }
  }

  close() {
    if (this.dc) {
      try { this.dc.close(); } catch (e) {}
    }
    try { this.pc.close(); } catch (e) {}
  }
}

export class LocalStorageSync {
  onMessageCallback: ((data: any) => void) | null = null;
  role: 'candidate' | 'interviewer';

  constructor(role: 'candidate' | 'interviewer') {
    this.role = role;
    window.addEventListener('storage', this.handleStorageChange);
  }

  handleStorageChange = (e: StorageEvent) => {
    if (e.key === 'ap_peer_sync' && e.newValue) {
      try {
        const payload = JSON.parse(e.newValue);
        if (payload.sender !== this.role) {
          if (this.onMessageCallback) {
            this.onMessageCallback(payload.data);
          }
        }
      } catch (err) {
        console.error('Error parsing storage event payload:', err);
      }
    }
  };

  send(data: any) {
    const payload = {
      sender: this.role,
      timestamp: Date.now(),
      data
    };
    localStorage.setItem('ap_peer_sync', JSON.stringify(payload));
  }

  close() {
    window.removeEventListener('storage', this.handleStorageChange);
    localStorage.removeItem('ap_peer_sync');
  }
}
