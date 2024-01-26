export enum UserRelation {
	friends,
	request_sent,
	request_received,
	blocked,
	none,
  }
  
  export class UserProfileDTO {
    constructor(
        public id: number,
        public name: string,
        public mmr: number,
        public rank: string,
        public matches: number,
        public winrate: number,
        public online: boolean
    ) {}
}