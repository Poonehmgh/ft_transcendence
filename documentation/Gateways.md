## Game

#### [game.DTOs.ts](..%2Fbackend%2Fsrc%2Fgame%2Fgame.DTOs.ts)

From user

| what                        | Message       | takes          |
|-----------------------------|---------------|----------------|
| To join game queue          | 'joinQueue'   | JoinGameDTO    |
| To send an update for plank | 'updatePLank' | PlankUpdateDTO |

To user

| what                                            | Message      | takes                                                                    |
|-------------------------------------------------|--------------|--------------------------------------------------------------------------|
| Receive the confirmation that queue was entered | queueConfirm | text 'Confirm' or 'InvalidID' or 'Already in queue' or 'Already in game' |
| Receive the the data to render new match        | newRound     | NewRoundDTO                                                              |
| Receive an update while rendering               | gameUpdate   | GameUpdateDTO                                                            |

## Chat

[chat.DTOs.ts](..%2Fbackend%2Fsrc%2Fchat%2Fchat.DTOs.ts)

From User

| what                                     | Message        | takes               |
|------------------------------------------|----------------|---------------------|
| Connect to gateway and get online status | connectMessage | EstablishConnectDTO |
| Send message to chat room                | sendMessage    | SendMessageDTO      |
| Create new chat room                     | createChat     | CreateNewChatDTO    |
| Invite a specific user to chat           | inviteUser     | InviteUserDTO    |

To user

| what                        | Message       | takes          |
|-----------------------------|---------------|----------------|
| get a new message just sent | updateMessage | SendMessageDTO |
| you was added to a new chat | updateChat    | ChatListDTO    |

For creating a dm chat name format is name1:name2

Probably should write a callback for users who got connected to chat for it to be displayed instantly