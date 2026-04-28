using PublicityHub.Application.DTOs.Proofs;

public interface IProofService
{
    Task<ProofDto> UploadAsync(CreateProofDto dto);
    Task<ProofDto> ApproveAsync(int proofId);
    Task<ProofDto> RejectAsync(int proofId);
    Task<ProofDto?> GetByAssignmentAsync(int assignmentId);
}
