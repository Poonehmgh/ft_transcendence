## Game

#### [game.DTOs.ts](..%2Fbackend%2Fsrc%2Fgame%2Fgame.DTOs.ts)

From user

| what                        | Message       | takes          |
|-----------------------------|---------------|----------------|
| To join game queue          | 'joinQueue'   | JoinGameDTO    |
| To send an update for plank | 'updatePLank' | PlankUpdateDTO |

To user

| what                                            | Message      | takes                                                   |
|-------------------------------------------------|--------------|---------------------------------------------------------|
| Receive the confirmation that queue was entered | queueConfirm | text 'Confirm' or 'InvalidID' or 'Already in queue' or 'Already in game' |
| Receive the the data to render new match        | newRound     | NewRoundDTO                                             |
| Receive an update while rendering               | gameUpdate   | GameUpdateDTO                                           |
