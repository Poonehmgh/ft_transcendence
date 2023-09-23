## User 

#### [user-dto.ts](..%2Fbackend%2Fsrc%2Fuser%2Fuser-dto.ts)

| what              | method  | controller-path                 | takes      | returns             | comment                                          |
|-------------------|---------|---------------------------------|------------|---------------------|--------------------------------------------------|
| create user       | Post    | user/new                        | NewUserDTO | -                   |                                                  |
| all users         | Get     | user/all                        | -          | IdAndNameDTO[]      |                                                  |
| score card        | Get     | user/scorecard                  | number     | ScoreCardDTO        |                                                  |
| matches           | Get     | user/matches                    | number     | number[]            |                                                  |
| friends           | Get     | user/friends                    | number     | IdAndNameDTO[]      |                                                  |
| online friends    | Get     | user/friends_online             | number     | IdAndNameDTO[]      |                                                  |
| friend management | Get     | user/friends_data               | number     | FriendListDTO       |                                                  |
| leaderboard       | Get     | user/leaderboard?top=n          | number     | ScoreCardDTO[]      | Query string. n = number of players to retrieve. |
| profile           | Get     | user/profile?id=n               | number     | UserProfileDTO      | Query string. n = userId                         |
| friend status     | Get     | user/friendstatus?id1=n1&id2=n2 | number     | FriendStatus (enum) | Query string. n1, n2 = userIds.                  |


## Match

[match-dto.ts](..%2Fbackend%2Fsrc%2Fmatch%2Fmatch-dto.ts)

| what              | method  | controller-path     | takes      | returns        |
|-------------------|---------|---------------------|------------|----------------|

## Game



| what          | method    | controller-path  | takes | returns        |
|---------------|-----------|------------------|-------|----------------|
