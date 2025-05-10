export interface OfferPayload {
  meetingId: string;
  offer: RTCSessionDescriptionInit;
}

export interface AnswerPayload {
  meetingId: string;
  answer: RTCSessionDescriptionInit;
}

export interface IceCandidatePayload {
  meetingId: string;
  candidate: RTCIceCandidateInit;
}

export interface MessagePayload {
  meetingId: string;
  senderId: string;
  content: string;
  timestamp: Date;
}
