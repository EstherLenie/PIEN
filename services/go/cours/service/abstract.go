package service

type MediaClient interface {
	// Marque un fichier comme orphelin (suppression différée)
	MarkOrphan(filePath string) error

	// Suppression définitive (optionnel, souvent via cron)
	Delete(filePath string) error
}
