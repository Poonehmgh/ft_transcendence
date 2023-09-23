import React from "react";

enum SocialStatus {
  friends,
  request_sent,
  request_received,
  blocked,
  none
}

interface SocialActionBar_a_prop {
    relation: SocialStatus
}

function SocialActionBar_a(props: SocialActionBar_a_prop): React.JSX.Element {
    switch (props.relation) {
        case SocialStatus.friends:
            return (<button onClick={void handleRemoveFriend}>Remove friend</button>);
        case SocialStatus.request_sent:
            return (<button onClick={void handleCancelFriendRequest}>Cancel friend request</button>);
        case SocialStatus.request_received:
            return (
                <div>
                    <button onClick={void handleAcceptFriendRequest}>Accept friend request</button>
                    <button onClick={void handleDeclineFriendRequest}>Decline friend request</button>
                </div>
            );
        case SocialStatus.blocked:
            return (<div/>);
        case SocialStatus.none:
            return (<button onClick={void handleAddFriend}>Add friend</button>);
        default:
            return (<button onClick={() => console.error('Error resolving relation between users')}>Error</button>);
    }
}

function  handleRemoveFriend(userId: number, otherId: number): void {
  // send rem friend to backend;
}

function handleCancelFriendRequest(userId: number, otherId: number): void {
  // send cancel request to backend;
}

function handleAcceptFriendRequest(userId: number, otherId: number): void {
  // send accept request to backend;
}

function handleDeclineFriendRequest(userId: number, otherId: number): void {
  // send decline request to backend;
}

function handleUnblockUser(userId: number, otherId: number): void {
  // send unblock request to backend;
}

function handleAddFriend(userId: number, otherId: number): void {
  // send add friend request to backend;
}

export default SocialActionBar_a;
