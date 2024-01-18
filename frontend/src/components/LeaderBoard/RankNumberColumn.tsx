import React from "react";
import Header from "../Header/Header_main";
import UserTable from "../shared/UserTable";

// CSS
import "src/styles/userTable.css";

interface rankNumberColumnProp {
    topN: number;
}

function RankNumberColumn(props: rankNumberColumnProp): React.JSX.Element {
    const rankingColumn = [];
    for (let i = 0; i < props.topN; i++) {
        rankingColumn.push(
            <tr key={i}>
                <td key={i}>{i + 1}</td>
            </tr>
        );
    }

    return (
        <div>
            <table className="userTable">
                <thead>
                    <tr>
                        <th>#</th>
                    </tr>
                </thead>
                <tbody>{rankingColumn}</tbody>
            </table>
        </div>
    );
}

export default RankNumberColumn;
