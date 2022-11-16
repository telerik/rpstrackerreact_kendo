import { Dialog } from '@progress/kendo-react-dialogs';
import { PtItem, PtUser } from "../../../../core/models/domain";
import { PtNewItem } from "../../../../shared/models/dto/pt-new-item";

export type AssigneeListModalProps = {
    modalIsShowing: boolean;
    setModalIsShowing: React.Dispatch<React.SetStateAction<boolean>>;
    users: PtUser[];
    selectAssignee: (user: PtUser) => void;
};


export function AssigneeListModal(props: AssigneeListModalProps) {

    const { modalIsShowing, setModalIsShowing, users, selectAssignee } = props;

    return modalIsShowing ? (
        <Dialog title="Select Assignee" onClose={() => setModalIsShowing(false)} width={400} height={600}>
            <ul className="list-group list-group-flush">
                {
                    users.map((u: PtUser) => {
                        return (
                            <li key={u.id} className="list-group-item d-flex justify-content-between align-items-center" onClick={() => selectAssignee(u)}>
                                <span>{u.fullName}</span>
                                <span className="badge ">
                                    <img src={u.avatar} className="li-avatar rounded mx-auto d-block" />
                                </span>
                            </li>
                        );
                    })
                }
            </ul>
        </Dialog>
    ) : null;
}