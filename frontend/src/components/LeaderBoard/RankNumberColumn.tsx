import React from "react";

// CSS
import "src/styles/userTable.css";

interface rankNumberColumnProp {
    n: number;
}

function RankNumberColumn(props: rankNumberColumnProp): React.JSX.Element {
    const rankingColumn = [];
    for (let i = 0; i < props.n; i++) {
        rankingColumn.push(
            <tr key={i}>
                <td key={i}>
                    {i + 1 === 1 ? "🥇" : i + 1 === 2 ? "🥈" : i + 1 === 3 ? "🥉" : i + 1}
                </td>
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
