import { Button } from "antd"
import { ArrowLeftOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom"

export default function Header({ title, description = "", actions = null, showBack = true }) {
    const navigate = useNavigate();

    return (
        <div className="page-header">
            <div className="page-header-back">
                {showBack && (
                    <Button
                        type="text"
                        className="back-button"
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate(-1)}
                    >
                        Back
                    </Button>
                )}
            </div>

            <div className="page-header-content">
                <h1>{title}</h1>
                <div>{actions}</div>
            </div>

            {description !== "" && <p>{description}</p>}
        </div>
    )
}