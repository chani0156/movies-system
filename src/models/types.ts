export interface Movie {
    id: number;
    description: string;
    totalVotes: number;
    lastUpdated: string;
  }
  
  export interface Vote {
    generatedTime: string;
    itemId: number;
    itemCount: number;
  }
  
  export interface LoginResponse {
    token: string;
  }
  