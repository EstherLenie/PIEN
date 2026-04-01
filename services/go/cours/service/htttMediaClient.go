package service

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type HttpMediaClient struct {
	baseURL string
	client  *http.Client
}

func NewHttpMediaClient(baseURL, apiKey string) *HttpMediaClient {
	return &HttpMediaClient{
		baseURL: baseURL,
		client: &http.Client{
			Timeout: 5 * time.Second,
		},
	}
}

func (m *HttpMediaClient) MarkOrphan(filePath string) error {
	payload := map[string]string{
		"filePath": filePath,
	}

	body, _ := json.Marshal(payload)

	req, err := http.NewRequest(
		http.MethodPost,
		fmt.Sprintf("%s/internal/media/orphan", m.baseURL),
		bytes.NewBuffer(body),
	)
	if err != nil {
		return err
	}

	req.Header.Set("Content-Type", "application/json")

	resp, err := m.client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 300 {
		return fmt.Errorf("media service returned %d", resp.StatusCode)
	}

	return nil
}

func (m *HttpMediaClient) Delete(filePath string) error {
	req, err := http.NewRequest(
		http.MethodDelete,
		fmt.Sprintf("%s/internal/media/%s", m.baseURL, filePath),
		nil,
	)
	if err != nil {
		return err
	}

	resp, err := m.client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 300 {
		return fmt.Errorf("media delete failed: %d", resp.StatusCode)
	}

	return nil
}
