import { useState } from "react";
import { EMPTY_STRING } from "../../../../core/helpers";
import { PtUser } from "../../../../core/models/domain";
import { Button } from "@progress/kendo-react-buttons";
import './pt-item-chitchat.css';

export type CommentFormProps = {
    addComment: (text: string) => void;
    currentUser: PtUser;
};

export function NewCommentForm(props: CommentFormProps) {

    const [newCommentText, setNewCommentText] = useState<string>(EMPTY_STRING);

    function onNewCommentChanged(e: any) {
        setNewCommentText(e.target.value);
    }

    function onAddTapped() {
        const newTitle = newCommentText.trim();
        if (newTitle.length === 0) {
            return;
        }
        props.addComment(newTitle);
        setNewCommentText(EMPTY_STRING);
    }

    const handleSubmit = (e: any) => {
        e.preventDefault();
        onAddTapped();
    };

    return (
        <form onSubmit={handleSubmit} className="new-comment-form">
            <div className="comment-input-container">
                <img src={props.currentUser.avatar} className="li-avatar rounded" alt="User avatar" />
                <textarea 
                    value={newCommentText} 
                    onChange={onNewCommentChanged} 
                    placeholder="Placeholder" 
                    className="comment-textarea"
                    name="newComment"
                />
            </div>
            <div className="comment-button-container">
                <Button 
                    type="button" 
                    onClick={onAddTapped} 
                    themeColor="primary" 
                    disabled={!newCommentText}
                    className="add-comment-btn"
                >
                    Add Comment
                </Button>
            </div>
        </form>
    );
}