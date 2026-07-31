export default function VoteControl({ score, onUpvote, onDownvote, disabled }) {
  return (
    <div className="vote-control">
      <button className="vote-btn up" onClick={onUpvote} disabled={disabled} title="Upvote" type="button">▲</button>
      <span className="vote-count">{score}</span>
      <button className="vote-btn down" onClick={onDownvote} disabled={disabled} title="Downvote" type="button">▼</button>
    </div>
  );
}
