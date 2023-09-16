## User

##### 'shared/DTO/user-dto.ts'

|what				|method		|controller-path		|takes			|returns
|---				|---		|---					|---			|---
|create user		|Post		|user/new				|NewUserDTO		|-
|all users			|Get		|user/all				|-				|IdAndNameDTO[]
|score card			|Get		|user/scorecard			|number			|ScoreCardDTO
|matches			|Get		|user/matches			|number			|number[]
|friends			|Get		|user/friends			|number			|IdAndNameDTO[]
|online friends		|Get		|user/friends_online	|number			|IdAndNameDTO[]
|friend management	|Get		|user/friends_data		|number			|FriendListDTO

<br>

## Matches

##### 'shared/DTO/match-dto.ts'

|what				|controller-path					|returntype
|---				|---					|---
|					|						|

# 