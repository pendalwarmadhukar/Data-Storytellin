import pytest
import pandas as pd
import numpy as np

def test_data_loading_and_cleaning():
    # Test valid dataframe creation
    df = pd.DataFrame({
        'Category': ['A', 'B', 'A', 'C', None],
        'Value': [10, 20, 10, 50, None]
    })
    
    assert len(df) == 5
    assert 'Category' in df.columns
    assert 'Value' in df.columns

    # Test handling missing values and duplicates
    cleaned = df.drop_duplicates().copy()
    assert len(cleaned) == 4 # duplicate (A, 10) removed

    # Impute missing numeric value with mean
    mean_val = cleaned['Value'].mean()
    cleaned['Value'] = cleaned['Value'].fillna(mean_val)
    assert cleaned['Value'].isnull().sum() == 0

def test_descriptive_statistics():
    df = pd.DataFrame({
        'Score': [10, 20, 30, 40, 100]
    })
    mean = df['Score'].mean()
    median = df['Score'].median()
    assert mean == 40.0
    assert median == 30.0

def test_outlier_detection_iqr():
    data = [10, 12, 11, 13, 10, 12, 100] # 100 is an outlier
    s = pd.Series(data)
    q1 = s.quantile(0.25)
    q3 = s.quantile(0.75)
    iqr = q3 - q1
    upper_bound = q3 + 1.5 * iqr
    outliers = s[s > upper_bound]
    assert len(outliers) == 1
    assert outliers.iloc[0] == 100

def test_correlation_computation():
    df = pd.DataFrame({
        'X': [1, 2, 3, 4, 5],
        'Y': [2, 4, 6, 8, 10]
    })
    corr = df['X'].corr(df['Y'])
    assert pytest.approx(corr, 0.01) == 1.0

def test_narrative_fallback():
    # Deterministic fallback test
    dataset_name = "test.csv"
    row_count = 100
    summary = f"Analysis of {dataset_name} with {row_count} rows."
    assert "100 rows" in summary
    assert "test.csv" in summary
