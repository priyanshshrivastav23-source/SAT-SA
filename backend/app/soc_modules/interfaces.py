from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional
from pydantic import BaseModel
from app.parsers.base import NormalizedDocument


class SOCEngineResult(BaseModel):
    engine_name: str
    is_ready: bool = False
    message: str = "Engine interface ready for future SOC assessment pipeline integration."
    schema_valid: bool = False
    applicable_category: str
    metadata: Dict[str, Any] = {}


class ExecutionGapEngineInterface(ABC):
    """
    Interface for future Execution Gap Engine:
    Analyzes discrepancies between declared SOC procedures/SLAs and actual forensic execution timestamps.
    """
    @abstractmethod
    def validate_schema(self, norm_doc: NormalizedDocument) -> bool:
        pass

    @abstractmethod
    def evaluate(self, norm_doc: NormalizedDocument) -> SOCEngineResult:
        pass


class NegativeSpaceEngineInterface(ABC):
    """
    Interface for future Negative Space Engine:
    Detects unmonitored assets, missing log sources, blind spots, and suppression anomalies.
    """
    @abstractmethod
    def validate_schema(self, norm_doc: NormalizedDocument) -> bool:
        pass

    @abstractmethod
    def evaluate(self, norm_doc: NormalizedDocument) -> SOCEngineResult:
        pass


class PeerBenchmarkingEngineInterface(ABC):
    """
    Interface for future Peer Benchmarking Engine:
    Benchmarks SOC operational metrics against industry/sector peer percentiles.
    """
    @abstractmethod
    def validate_schema(self, norm_doc: NormalizedDocument) -> bool:
        pass

    @abstractmethod
    def evaluate(self, norm_doc: NormalizedDocument) -> SOCEngineResult:
        pass


class GoodhartLensInterface(ABC):
    """
    Interface for future Goodhart Lens:
    Identifies gaming of KPIs (e.g. premature case closure to meet MTTR targets).
    """
    @abstractmethod
    def validate_schema(self, norm_doc: NormalizedDocument) -> bool:
        pass

    @abstractmethod
    def evaluate(self, norm_doc: NormalizedDocument) -> SOCEngineResult:
        pass


class EvidenceFusionInterface(ABC):
    """
    Interface for future Evidence Fusion Engine:
    Cross-correlates multi-source evidence (CSE reports, SIEM alerts, supervisory audits).
    """
    @abstractmethod
    def validate_schema(self, norm_doc: NormalizedDocument) -> bool:
        pass

    @abstractmethod
    def evaluate(self, norm_doc: NormalizedDocument) -> SOCEngineResult:
        pass


class ReviewPlannerInterface(ABC):
    """
    Interface for future Review Planner:
    Synthesizes inspection findings into targeted supervisory audit schedules and sample sets.
    """
    @abstractmethod
    def validate_schema(self, norm_doc: NormalizedDocument) -> bool:
        pass

    @abstractmethod
    def evaluate(self, norm_doc: NormalizedDocument) -> SOCEngineResult:
        pass
