import os
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, './predictive_model/data/Natural_Disasters_in_India.csv')
GRAPH_DIR = os.path.join(BASE_DIR, '../static/graphs')
os.makedirs(GRAPH_DIR, exist_ok=True)

dataf = pd.read_csv(DATA_PATH).drop(columns=['Unnamed: 0'], errors='ignore')
dataf.dropna(inplace=True)
dataf['Date'] = pd.to_datetime(dataf['Date'], errors='coerce')
dataf.dropna(subset=['Date'], inplace=True)
dataf['Year'] = dataf['Date'].dt.year

def get_df(key_words):
    DF = pd.DataFrame(columns=dataf.columns)
    for _, row in dataf.iterrows():
        for key_word in key_words:
            if key_word in row['Title'].lower().split():
                DF.loc[len(DF.index)] = row
    return DF.dropna()

def plot_disasters_per_year():
    data_count = dataf.groupby('Year').count()['Disaster_Info']
    years = data_count.index
    plt.figure(figsize=(15, 4))
    plt.bar(years, data_count)
    plt.xlabel("Year", fontweight='bold')
    plt.ylabel("No. of Disasters", fontweight='bold')
    plt.title("Disasters per year", fontweight='bold')
    plt.xticks(rotation=60)
    plt.tight_layout()
    plt.savefig(os.path.join(GRAPH_DIR, 'disasters_per_year.png'))
    plt.close()

def plot_time_data_improved(df, title, filename):
    try:
        df['Date'] = pd.to_datetime(df['Date'])
    except:
        pass
    fig, ax = plt.subplots(figsize=(15, 6))
    ax.plot(df['Date'], df['Title'], marker='o', linestyle='-')
    ax.set(title=title)
    ax.xaxis.set_major_locator(mdates.AutoDateLocator())
    ax.xaxis.set_major_formatter(mdates.DateFormatter('%Y-%m-%d'))
    plt.setp(ax.get_xticklabels(), rotation=45, ha="right")
    plt.grid(True, linestyle='--', alpha=0.7)
    plt.tight_layout()
    plt.savefig(os.path.join(GRAPH_DIR, filename))
    plt.close()

def predict_future_disasters(df, disaster_type, filename, years_to_predict=5):
    df['Date'] = pd.to_datetime(df['Date'], errors='coerce')
    df = df.dropna(subset=['Date'])
    df.set_index('Date', inplace=True)
    yearly_counts = df.resample('Y').count()['Title']
    avg_count = yearly_counts.mean()
    last_year = yearly_counts.index[-1].year
    future_years = pd.date_range(start=f'{last_year + 1}-01-01', periods=years_to_predict, freq='Y')
    predicted_counts = pd.Series(avg_count, index=future_years)
    combined_data = pd.concat([yearly_counts, predicted_counts])

    plt.figure(figsize=(12, 6))
    combined_data.plot(marker='o', linestyle='-')
    plt.title(f'Predicted {disaster_type} Occurrences in India')
    plt.xlabel('Year')
    plt.ylabel('Number of Occurrences')
    plt.axvline(x=future_years[0], color='r', linestyle='--', label='Prediction Start')
    plt.legend()
    plt.tight_layout()
    plt.savefig(os.path.join(GRAPH_DIR, filename))
    plt.close()

def generate_all_graphs():
    plot_disasters_per_year()
    plot_time_data_improved(get_df(['earthquake', 'earthquakes']), "Major Earthquakes in 31 years", "earthquakes.png")
    plot_time_data_improved(get_df(['flood', 'floods']), "Major Floods in 31 years", "floods.png")
    plot_time_data_improved(get_df(['cyclone', 'cyclones']), "Major Cyclones in 31 years", "cyclones.png")
    plot_time_data_improved(get_df(['landslide', 'landslides']), "Major Landslides in 31 years", "landslides.png")
    predict_future_disasters(get_df(['flood', 'floods']), "Flood", "predicted_floods.png")
