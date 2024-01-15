import React from "react";
import { UserRelation } from "../../DTO/user-dto";
import { blockUser, unblockUser } from "src/ApiCalls/userActions";

interface BlockButton_prop {
    relation: UserRelation,
	thisId: number,
	otherId: number
}

function BlockButton(props: BlockButton_prop): React.JSX.Element {
    switch (props.relation) {
        case UserRelation.blocked:
            return (<button onClick={void unblockUser(props.thisId, props.otherId)}>Unblock user</button>);
        default:
            return (<button onClick={void blockUser(props.thisId, props.otherId)}>Block user</button>);
    }
}

export default BlockButton;
