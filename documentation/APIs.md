## User 

#### [user-dto.ts](..%2FDTO%2Fuser-dto.ts)

| what              | method  | controller-path        | takes      | returns        | comment                                        |
|-------------------|---------|------------------------|------------|----------------|------------------------------------------------|
| create user       | Post    | user/new               | NewUserDTO | -              |                                                |
| all users         | Get     | user/all               | -          | IdAndNameDTO[] |                                                |
| score card        | Get     | user/scorecard         | number     | ScoreCardDTO   |                                                |
| matches           | Get     | user/matches           | number     | number[]       |                                                |
| friends           | Get     | user/friends           | number     | IdAndNameDTO[] |                                                |
| online friends    | Get     | user/friends_online    | number     | IdAndNameDTO[] |                                                |
| friend management | Get     | user/friends_data      | number     | FriendListDTO  |                                                |
| leaderboard       | Get     | user/leaderboard?top=n | number     | ScoreCardDTO[] | give desired number of top players to retrieve |

## Match

##### [match-dto.ts](..%2FDTO%2Fmatch-dto.ts)

| what              | method  | controller-path     | takes      | returns        |
|-------------------|---------|---------------------|------------|----------------|

## Game

###### [game-dto.ts](..%2FDTO%2Fgame-dto.ts)

| what          | method    | controller-path  | takes | returns        |
|---------------|-----------|------------------|-------|----------------|
