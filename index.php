<?php
// Fallback jika diakses via index.php di Laragon
if (file_exists(__DIR__ . '/dist/index.html')) {
    include __DIR__ . '/dist/index.html';
} else {
    echo "Harap jalankan 'npm run build' terlebih dahulu.";
}

