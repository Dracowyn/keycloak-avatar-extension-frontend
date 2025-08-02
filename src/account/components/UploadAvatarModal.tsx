import React, { useState, useEffect } from "react";
import {
    Avatar,
    Button,
    FileUpload,
    Form,
    FormGroup,
    HelperText,
    HelperTextItem,
    Modal,
    ModalVariant,
    Tooltip,
    Flex,
    FlexItem
} from "@patternfly/react-core";
import { useTranslation } from "react-i18next";
import { useEnvironment } from "../../shared/keycloak-ui-shared";
import type { Environment } from "../environment";
import "./UploadAvatarModal.css";

interface UploadAvatarModalProps {
    buttonId?: string;
    buttonTitle?: string;
    isDisabled?: boolean;
    onChange?: (avatarUrl: string) => void;
    onClose?: () => void;
    render?: (openModal: () => void) => React.ReactNode;
}

export const UploadAvatarModal: React.FC<UploadAvatarModalProps> = ({
    buttonId = "upload-avatar-btn",
    buttonTitle,
    isDisabled = false,
    onChange,
    onClose,
    render
}) => {
    const { t } = useTranslation();
    const context = useEnvironment<Environment>();

    const [isOpen, setIsOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedFileName, setSelectedFileName] = useState("");
    const [selectedFileUrl, setSelectedFileUrl] = useState<string | null>(null);
    const [avatarUrl, setAvatarUrl] = useState("");
    const [saveBtnLabel, setSaveBtnLabel] = useState(t("save"));
    const [saveBtnEnabled, setSaveBtnEnabled] = useState(true);
    const [fileError, setFileError] = useState("");

    // Initialize avatar URL
    useEffect(() => {
        if (context.keycloak) {
            const baseUrl = context.keycloak.authServerUrl;
            const realm = context.keycloak.realm;
            const timestamp = new Date().getTime();
            setAvatarUrl(`${baseUrl}/realms/${realm}/avatar?_=${timestamp}`);
        }
    }, [context.keycloak]);

    const handleFileChange = (file: File | null, filename: string) => {
        // Revoke previous URL to prevent memory leaks
        if (selectedFileUrl) {
            URL.revokeObjectURL(selectedFileUrl);
        }

        let newFileUrl: string | null = null;
        if (file) {
            newFileUrl = URL.createObjectURL(file);
        }

        setSelectedFile(file);
        setSelectedFileName(filename);
        setSelectedFileUrl(newFileUrl);
        setFileError("");
    };

    const handleModalToggle = (open?: boolean) => {
        const newIsOpen = open !== undefined ? open : !isOpen;
        setIsOpen(newIsOpen);

        if (!newIsOpen) {
            // Reset state when closing
            handleFileChange(null, "");
            setFileError("");
            setSaveBtnLabel(t("save"));
            setSaveBtnEnabled(true);

            if (onClose) {
                onClose();
            }
        }
    };

    const validateAvatar = (): boolean => {
        if (!selectedFile) {
            setFileError(t("selectFileToUpload"));
            return false;
        }
        return true;
    };

    const handleSaveAvatar = async () => {
        if (!validateAvatar()) return;

        if (!selectedFile) {
            setFileError(t("selectFileToUpload"));
            return;
        }

        const formData = new FormData();
        formData.append("image", selectedFile);

        setSaveBtnEnabled(false);
        setSaveBtnLabel(t("uploading"));

        try {
            const baseUrl = context.keycloak?.authServerUrl;
            const realm = context.keycloak?.realm;

            const response = await fetch(`${baseUrl}/realms/${realm}/avatar`, {
                method: "POST",
                body: formData,
                credentials: "include"
            });

            if (!response.ok) {
                console.error("HTTP request failed with status:", response.status);
            }

            const data = await response.json();

            if (data.status === 1) {
                if (onChange) {
                    onChange(data.avatar);
                }

                const timestamp = new Date().getTime();
                setAvatarUrl(`${data.avatar}?_=${timestamp}`);
                handleModalToggle(false);
            } else {
                const errorMsg = data.errormsg || data.error || t("uploadFailed");
                setFileError(`${t("uploadAvatarFailed")}: ${errorMsg}`);
            }
        } catch (error) {
            console.error("Cannot save avatar", error);
            setFileError(
                `${t("uploadRequestFailed")}: ${error instanceof Error ? error.message : t("unknownError")}`
            );
        } finally {
            setSaveBtnEnabled(true);
            setSaveBtnLabel(t("save"));
        }
    };

    return (
        <>
            {/* Avatar button */}
            <Tooltip content={buttonTitle || t("uploadAvatar")}>
                <Button
                    id={buttonId}
                    variant="link"
                    onClick={() => handleModalToggle(true)}
                    isDisabled={isDisabled}
                >
                    <Avatar src={avatarUrl} alt="avatar" size={"xl"} />
                </Button>
            </Tooltip>

            {/* Custom render prop */}
            {render && render(() => handleModalToggle(true))}

            {/* Upload modal */}
            <Modal
                className="upload-avatar-modal"
                title={t("uploadAvatar")}
                variant={ModalVariant.small}
                isOpen={isOpen}
                onClose={() => handleModalToggle(false)}
                actions={[
                    <Button
                        key="confirm"
                        variant="primary"
                        onClick={handleSaveAvatar}
                        isDisabled={!saveBtnEnabled}
                    >
                        {saveBtnLabel}
                    </Button>,
                    <Button
                        key="cancel"
                        variant="link"
                        onClick={() => handleModalToggle(false)}
                    >
                        {t("cancel")}
                    </Button>
                ]}
            >
                <Form isHorizontal>
                    <FormGroup
                        fieldId="avatar-file"
                        style={{ display: "flex" }}
                        className={"fileSelectFormGroup"}
                    >
                        {fileError && (
                            <HelperText>
                                <HelperTextItem variant="error">
                                    {fileError}
                                </HelperTextItem>
                            </HelperText>
                        )}
                        <FileUpload
                            id="avatar-file"
                            type="dataURL"
                            value={selectedFile || undefined}
                            filename={selectedFileName}
                            filenamePlaceholder={t("dragFileHereOrSelectFile")}
                            onFileInputChange={(_, file) =>
                                handleFileChange(file, file?.name || "")
                            }
                            onClearClick={() => handleFileChange(null, "")}
                            hideDefaultPreview
                            browseButtonText={t("selectFile")}
                            clearButtonText={t("clear")}
                            accept="image/*"
                            allowEditingUploadedText={false}
                        />

                        {/* Image preview */}
                        {selectedFileUrl && (
                            <Flex
                                justifyContent={{ default: "justifyContentCenter" }}
                                style={{ marginTop: "var(--pf-v5-global--spacer--md)" }}
                            >
                                <FlexItem>
                                    <img
                                        src={selectedFileUrl}
                                        alt={t("previewImage")}
                                        className="avatar-preview-image"
                                    />
                                </FlexItem>
                            </Flex>
                        )}
                    </FormGroup>
                </Form>
            </Modal>
        </>
    );
};

export default UploadAvatarModal;
