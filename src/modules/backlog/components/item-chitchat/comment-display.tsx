import { PtComment } from "../../../../core/models/domain";
import { Typography } from '@progress/kendo-react-common';

export type PtCommentDisplayComponentProps = {
    comment: PtComment;
};

export function PtCommentDisplayComponent(props: PtCommentDisplayComponentProps) {

    const { comment } = props;
    const dateStr = comment.dateCreated.toDateString();

    return (
        <li className="chitchat-item">
            <div className="comment-item-container">
                <img src={comment.user!.avatar} className="li-avatar rounded" alt="User avatar" />
                <div className="media-body">
                    <Typography.h6 className="mt-0 mb-1"><span>{comment.user!.fullName}</span><span className="comment-date">{dateStr}</span></Typography.h6>
                    <span className="chitchat-text">{comment.title}</span>
                </div>
            </div>
        </li>
    );
}