
import { Button } from "antd"
import { RollbackOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom"

export default function Header({ title, description = "", actions = null, showBack = true }) {
    const navigate = useNavigate();

    return (
        <div style={{ display: "flex", flexDirection: "column", marginBottom: 8, gap: 2, justifySelf: "center" }}>
            <div style={{ height: 32 }}>
                {showBack && (
                    <Button
                        type="text"
                        icon={<RollbackOutlined />}
                        onClick={() => navigate(-1)}
                    />
                )}
            </div>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <h1>{title}</h1>
                <div>
                    {actions}
                </div>
            </div>
            {description !== "" && <p>{description}</p>}
        </div>
    )
}
